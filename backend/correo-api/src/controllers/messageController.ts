import { Request, Response } from 'express';
import Imap from 'node-imap';
import { simpleParser, ParsedMail } from 'mailparser';
import { config } from '../config/env.config';
import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

prisma.$connect()
  .then(() => console.log('✅ Conectado a la base de datos'))
  .catch((err: Error) => {
    console.error('❌ Error al conectar a la base de datos:', err);
    process.exit(1);
  });

const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 segundos

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const connectImap = async (retryCount = 0): Promise<Imap> => {
  try {
    const imap = new Imap(config.email);
    return new Promise((resolve, reject) => {
      imap.once('ready', () => resolve(imap));
      imap.once('error', (err) => reject(err));
      imap.connect();
    });
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.log(`Intento ${retryCount + 1} fallido, reintentando en ${RETRY_DELAY}ms...`);
      await sleep(RETRY_DELAY);
      return connectImap(retryCount + 1);
    }
    throw error;
  }
};

export const getEmails = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔄 Iniciando conexión IMAP...');
    const imap = await connectImap();
    console.log('✅ Conexión IMAP establecida');
    
    const messages: {
      username: string;
      question: string;
      date: Date;
      messageId: string;
    }[] = [];

    await new Promise<void>((resolve, reject) => {
      imap.openBox('INBOX', false, (err) => {
        if (err) {
          console.error('❌ Error al abrir INBOX:', err);
          reject(err);
          return;
        }

        imap.search(['ALL'], async (err, results) => {
          if (err) {
            console.error('❌ Error al buscar mensajes:', err);
            reject(err);
            return;
          }
          
          if (!results || results.length === 0) {
            console.log('ℹ️ No hay mensajes nuevos');
            imap.end();
            resolve();
            return;
          }

          console.log(`📧 Encontrados ${results.length} mensajes`);
          const fetch = imap.fetch(results, { bodies: '' });

          fetch.on('message', (msg) => {
            msg.on('body', async (stream: any) => {
              try {
                const parsed = await simpleParser(stream as any) as ParsedMail;
                const username = parsed.from?.text || 'Desconocido';
                const question = parsed.subject || '(Sin asunto)';
                const date = parsed.date || new Date();
                const messageId = parsed.messageId || `${date.getTime()}-${Math.random()}`;

                console.log(`📨 Procesando mensaje de ${username}: ${question}`);
                
                try {
                  const exists = await prisma.message.findUnique({
                    where: { messageId },
                  });

                  if (!exists) {
                    console.log(`💾 Guardando mensaje de ${username}`);
                    await prisma.message.create({
                      data: { username, question, date, messageId },
                    });
                    messages.push({ username, question, date, messageId });
                    console.log(`✅ Mensaje guardado correctamente`);
                  } else {
                    console.log(`ℹ️ Mensaje ya existe, saltando`);
                  }
                } catch (dbError) {
                  console.error('❌ Error al guardar en la base de datos:', dbError);
                }
              } catch (parseError) {
                console.error('❌ Error al parsear mensaje:', parseError);
              }
            });
          });

          fetch.once('end', () => {
            console.log('✅ Procesamiento de mensajes completado');
            imap.addFlags(results, '\\Seen', (flagErr) => {
              if (flagErr) console.error('❌ Error al marcar como leído:', flagErr);
            });
            imap.end();
            resolve();
          });

          fetch.once('error', (err) => {
            console.error('❌ Error en fetch:', err);
            reject(err);
          });
        });
      });
    });

    console.log(`📤 Enviando ${messages.length} mensajes nuevos al cliente`);
    res.json(messages);
  } catch (error) {
    console.error('❌ Error en getEmails:', error);
    res.status(500).json({
      error: 'Error al procesar los correos',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const getAllMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { date: 'desc' },
    });
    res.json(messages);
  } catch (error) {
    console.error('❌ Error al obtener los mensajes:', error);
    res.status(500).json({ error: 'Error al recuperar los mensajes guardados' });
  }
};

export const deleteMessage = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  try {
    const deleted = await prisma.message.delete({
      where: { id: parseInt(id) },
    });
    return res.json({ deleted: true });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Mensaje no encontrado" });
    }
    console.error("❌ Error al eliminar mensaje:", error);
    return res.status(500).json({ error: "Error al eliminar el mensaje" });
  }
};

export const respondToMessage = async (req: Request, res: Response) => {
  const { to, subject, text } = req.body;

  if (!to || !text) {
    return res.status(400).json({ error: 'Faltan campos requeridos (to, text)' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.email.user,
        pass: config.email.password,
      },
    });

    await transporter.sendMail({
      from: `"TeamUp Support" <${config.email.user}>`,
      to,
      subject: subject || 'Respuesta a tu mensaje',
      text,
    });

    res.json({ success: true, message: 'Correo enviado correctamente' });
  } catch (error) {
    console.error('❌ Error al enviar correo:', error);
    res.status(500).json({ error: 'No se pudo enviar el correo' });
  }
};
