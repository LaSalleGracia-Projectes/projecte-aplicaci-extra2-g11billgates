import { Request, Response } from 'express';
import LinkModel from '../models/link.model';

export const getAllLinks = async (req: Request, res: Response): Promise<Response> => {
    try {
      const links = await LinkModel.find().sort({ createdAt: -1 });
      return res.json(links);
    } catch (error) {
      console.error('❌ Error al obtener enlaces:', error);
      return res.status(500).json({ error: 'No se pudieron obtener los enlaces' });
    }
};

export const createLink = async (req: Request, res: Response): Promise<Response> => {
    const { url, description, type } = req.body;
  
    if (!url || !description || !type) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
  
    try {
      const newLink = await LinkModel.create({ url, description, type });
      return res.status(201).json(newLink);
    } catch (error) {
      console.error('❌ Error al crear enlace:', error);
      return res.status(500).json({ error: 'No se pudo crear el enlace' });
    }
};

export const updateLink = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { url, description, type } = req.body;
  
    try {
      const updated = await LinkModel.findByIdAndUpdate(
        id,
        { url, description, type },
        { new: true }
      );
  
      if (!updated) {
        return res.status(404).json({ error: 'Enlace no encontrado' });
      }
  
      return res.json(updated);
    } catch (error) {
      console.error('❌ Error al actualizar enlace:', error);
      return res.status(500).json({ error: 'No se pudo actualizar el enlace' });
    }
};
  
export const deleteLink = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
  
    try {
      const deleted = await LinkModel.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Enlace no encontrado' });
      }
  
      return res.json({ message: 'Enlace eliminado correctamente' });
    } catch (error) {
      return res.status(500).json({ error: 'No se pudo eliminar el enlace' });
    }
};
  