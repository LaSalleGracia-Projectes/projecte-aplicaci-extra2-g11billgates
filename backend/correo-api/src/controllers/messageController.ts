import { Request, Response } from 'express';
import Imap from 'node-imap';
import { simpleParser, ParsedMail } from 'mailparser';
import MessageModel from '../models/message.model';
import { config } from '../config/env.config';

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

export const getEmails = async (req: Request, res: Response) => {
  try {
    const imap = await connectImap();
    const messages: {
      username: string;
      question: string;
      date: Date;
      messageId: string;
    }[] = [];

    await new Promise<void>((resolve, reject) => {
      imap.openBox('INBOX', false, (err) => {
        if (err) reject(err);

        imap.search(['ALL'], async (err, results) => {
          if (err) reject(err);
          if (!results || results.length === 0) {
            imap.end();
            resolve();
            return;
          }

          const fetch = imap.fetch(results, { bodies: '' });

          fetch.on('message', (msg) => {
            msg.on('body', async (stream: any) => {
              try {
                const parsed = await simpleParser(stream as any) as ParsedMail;
                const username = parsed.from?.text || 'Desconocido';
                const question = parsed.subject || '(Sin asunto)';
                const date = parsed.date || new Date();
                const messageId = parsed.messageId || `${date.getTime()}-${Math.random()}`;

                const exists = await MessageModel.findOne({ messageId });
                if (!exists) {
                  await MessageModel.create({ username, question, date, messageId });
                  messages.push({ username, question, date, messageId });
                }
              } catch (parseError) {
                console.error('Error al parsear mensaje:', parseError);
              }
            });
          });

          fetch.once('end', () => {
            imap.addFlags(results, '\\Seen', (flagErr) => {
              if (flagErr) console.error('Error al marcar como leído:', flagErr);
            });
            imap.end();
            resolve();
          });

          fetch.once('error', (err) => {
            reject(err);
          });
        });
      });
    });

    res.json(messages);
  } catch (error) {
    console.error('Error en getEmails:', error);
    res.status(500).json({ 
      error: 'Error al procesar los correos',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};
export const getAllMessages = async (req: Request, res: Response) => {
  try {
    const messages = await MessageModel.find().sort({ date: -1 });
    res.json(messages);
  } catch (error) {
    console.error('❌ Error al obtener los mensajes:', error);
    res.status(500).json({ error: 'Error al recuperar los mensajes guardados' });
  }
};
