import { Request, Response } from 'express';
import UserModel from '../models/user.model';

export const warnUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        user.warnings = (user.warnings || 0) + 1;

        if (user.warnings >= 5) {
            user.banned = true;
        }

        await user.save();

        if (user.banned) {
            res.json({ message: `Usuario ${user.username} ha sido baneado automáticamente tras 5 advertencias.` });
        } else {
            res.json({ message: `Usuario ${user.username} ha recibido una advertencia (${user.warnings}/5).` });
        }
    } catch (error) {
        console.error('Error al advertir usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
export const banUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        user.banned = true;
        await user.save();

        res.json({ message: `Usuario ${user.username} baneado manualmente.` });
    } catch (error) {
        console.error('Error al banear usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const unbanUser = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const user = await UserModel.findById(userId);
  
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  
      user.banned = false;
      await user.save();
  
      res.json({ message: `Usuario ${user.username} ha sido desbaneado.` });
    } catch (error) {
      console.error('Error al desbanear usuario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  export const removeWarning = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const user = await UserModel.findById(userId);
  
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  
      if (user.warnings > 0) {user.warnings -= 1;
  
        if (user.banned && user.warnings < 5) {
          user.banned = false; 
        }
  
        await user.save();
  
        res.json({ message: `Advertencia eliminada. ${user.username} tiene ahora ${user.warnings}/5.` });
      } else {
        res.json({ message: `Usuario ${user.username} no tiene advertencias que eliminar.` });
      }
    } catch (error) {
      console.error('Error al eliminar advertencia:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };