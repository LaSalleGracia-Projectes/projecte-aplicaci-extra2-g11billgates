import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['EMAIL_USER', 'EMAIL_PASS', 'MONGO_URI'] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`La variable de entorno ${envVar} es requerida`);
  }
}

export const config = {
  email: {
    user: process.env.EMAIL_USER!,
    password: process.env.EMAIL_PASS!,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
  },
  mongodb: {
    uri: process.env.MONGO_URI!,
  },
  port: process.env.PORT || 3001,
}; 