import mongoose, { Schema, Document } from 'mongoose';
import { IMessage } from '../interfaces/message.interface';

const MessageSchema: Schema = new Schema({
  username: { type: String, required: true },
  question: { type: String, required: true },
  date: { type: Date, default: Date.now },
  messageId: { type: String, required: true, unique: true }, 
});

export default mongoose.model<IMessage & Document>('Message', MessageSchema);
