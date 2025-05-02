import { Request, Response } from 'express';
import User from '../models/user.model';

export const getUserStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'Activo' });
    const admins = await User.countDocuments({ role: 'Administrador' });
    const suspendedUsers = await User.countDocuments({ banned: true });

    res.json({
      totalUsers,
      activeUsers,
      admins,
      suspendedUsers
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas de usuarios' });
  }
}; 