import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db';
import userRoutes from './routes/userRoutes';
import statsRoutes from './routes/stats.routes';

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api', statsRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor user-api corriendo en http://localhost:${PORT}`);
});
