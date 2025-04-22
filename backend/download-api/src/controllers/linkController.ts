import { Request, Response } from 'express';
import LinkModel from '../models/link.model';


export const getAllLinks = async (req: Request, res: Response) => {
    try {
      const links = await LinkModel.find().sort({ createdAt: -1 });
      res.json(links);
    } catch (error) {
      console.error('❌ Error al obtener enlaces:', error);
      res.status(500).json({ error: 'No se pudieron obtener los enlaces' });
    }
  };

  export const createLink = async (req: Request, res: Response) => {
    const { url, description, type } = req.body;
  
    if (!url || !description || !type) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
  
    try {
      const newLink = await LinkModel.create({ url, description, type });
      res.status(201).json(newLink);
    } catch (error) {
      console.error('❌ Error al crear enlace:', error);
      res.status(500).json({ error: 'No se pudo crear el enlace' });
    }
  };
  