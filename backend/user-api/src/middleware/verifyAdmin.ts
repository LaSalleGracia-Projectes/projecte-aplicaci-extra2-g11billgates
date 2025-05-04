import { Response, NextFunction } from 'express';
import { AuthRequest } from '../interfaces/auth.interface';

export const verifyAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Usuario no autenticado' });
    return;
  }

  if (req.user.role !== 'Administrador') {
    res.status(403).json({ error: 'Acceso denegado: solo administradores' });
    return;
  }

  next();
};
