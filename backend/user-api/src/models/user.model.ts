import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../interfaces/user.interface';

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Administrador', 'Usuario'], default: 'Usuario' },
  status: { type: String, enum: ['Activo', 'Inactivo'], default: 'Activo' },
});

export default mongoose.model<IUser & Document>('User', UserSchema);
