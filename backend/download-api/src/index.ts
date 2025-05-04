import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import linkRoutes from './routes/linkRoutes';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/links', linkRoutes);

const PORT = process.env.PORT || 3005;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
});
