import express from 'express';
import cors from 'cors';
import messageRoutes from './routes/messageRoutes';
import { config } from './config/env.config';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/emails', messageRoutes);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Error interno del servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(config.port, () => {
  console.log(`Servidor escuchando en el puerto ${config.port}`);
});
