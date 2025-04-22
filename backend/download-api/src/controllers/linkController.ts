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