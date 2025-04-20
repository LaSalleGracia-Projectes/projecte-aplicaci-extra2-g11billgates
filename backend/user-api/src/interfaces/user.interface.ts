export interface IUser {
    _id?: string;
    username: string;
    password: string;
    role: 'Administrador' | 'Usuario';
    status: 'Activo' | 'Inactivo';
  }
  