import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../interfaces/auth.interface';

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token no proporcionado' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    
    if (typeof decoded === 'object' && 'id' in decoded && 'role' in decoded) {
      req.user = {
        id: decoded.id,
        role: decoded.role,
      };
    } else {
      throw new Error('Token no válido');
    }

    next();
  } catch (error) {
    console.error('❌ Token inválido:', error);
    res.status(403).json({ error: 'Token inválido o expirado' });
  }
};
