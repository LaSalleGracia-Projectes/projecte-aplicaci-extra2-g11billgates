import mongoose, { Schema, Document } from 'mongoose';
import { ILink } from '../interfaces/link.interface';

const LinkSchema: Schema = new Schema({
  url: { type: String, required: true },
  type: { type: String, enum: ['descarga', 'actualizacion'], required: true },
  description: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<ILink & Document>('Link', LinkSchema);
