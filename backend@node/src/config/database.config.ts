import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI?.trim() || '';
if (!MONGO_URI) {
  throw new Error('MONGO_URI is required in environment configuration');
}

mongoose.set('strictQuery', true);

export async function connectDatabase() {
  return mongoose.connect(MONGO_URI, {
    dbName: 'kisansathi',
  });
}
