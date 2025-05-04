import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/user.model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      res.status(400).json({ error: 'Faltan usuario o contraseña' });
      return;
    }
  
    try {
      const user = await UserModel.findOne({ username });
  
      if (!user) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        res.status(401).json({ error: 'Contraseña incorrecta' });
        return;
      }
  
      const token = jwt.sign(
        {
          id: user._id,
          role: user.role,
        },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: '12h' }
      );
  
      res.json({
        message: 'Login exitoso',
        user: {
          _id: user._id,
          username: user.username,
          role: user.role,
          status: user.status,
        },
        token,
      });
    } catch (error) {
      console.error('❌ Error al iniciar sesión:', error);
      res.status(500).json({ error: 'Error en el login' });
    }
  };
  

const blacklistedTokens: string[] = [];

export const logout = (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(400).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];
  blacklistedTokens.push(token); 

  res.json({ message: 'Sesión cerrada correctamente' });
};

export const isTokenBlacklisted = (token: string) => {
  return blacklistedTokens.includes(token);
};
