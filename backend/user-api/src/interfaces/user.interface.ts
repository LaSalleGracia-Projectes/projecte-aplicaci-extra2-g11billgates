export interface IUser {
    _id?: string;
    username: string;
    password: string;
    role: 'Administrador' | 'Usuario';
    status: 'Activo' | 'Inactivo';
    bloqueado?: boolean;
    advertencias?: number;
    warnings?: number;
    banned?: boolean;
  }
  