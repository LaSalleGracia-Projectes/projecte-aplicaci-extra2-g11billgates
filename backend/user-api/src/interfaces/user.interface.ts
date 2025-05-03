export interface IUser {
    _id?: string;
    username: string;
    password: string;
    role: 'Administrador' | 'Usuario';
    status: 'Activo' | 'Inactivo';
    reported?: boolean;
    reason?: 'Comportamiento tóxico' | 'Vocabulario inadecuado' | 'Otro';
    warnings?: number;
    banned?: boolean;
  }
  