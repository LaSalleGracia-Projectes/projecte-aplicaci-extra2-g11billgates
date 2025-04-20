import mongoose from 'mongoose';
import { config } from './env.config';

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodb.uri);
    console.log('Conectado a MongoDB Atlas');
  } catch (error) {
    console.error(' Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};
