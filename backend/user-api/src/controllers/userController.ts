import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await UserModel.find().select('-__v');
      res.json(users);
    } catch (error) {
      console.error('❌ Error al obtener usuarios:', error);
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  };

  export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, password, role = 'Usuario', status = 'Activo' } = req.body;
  
    if (!username || !password) {
      res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
      return;
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await UserModel.create({
        username,
        password: hashedPassword,
        role,
        status,
      });
  
      res.status(201).json(newUser);
    } catch (error) {
      console.error('❌ Error al crear usuario:', error);
      res.status(500).json({ error: 'No se pudo crear el usuario' });
    }
  };
  
  export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const { username, password, role, status } = req.body;
  
    try {
      const updateData: any = { username, role, status };
  
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }
  
      const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, {
        new: true,
      });
  
      if (!updatedUser) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }
  
      res.json(updatedUser);
    } catch (error) {
      console.error('❌ Error al actualizar usuario:', error);
      res.status(500).json({ error: 'No se pudo actualizar el usuario' });
    }
  };
  
  export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
  
    try {
      const deletedUser = await UserModel.findByIdAndDelete(id);
  
      if (!deletedUser) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }
  
      res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
      console.error('❌ Error al eliminar usuario:', error);
      res.status(500).json({ error: 'No se pudo eliminar el usuario' });
    }
  };

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

  