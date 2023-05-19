import dotenv from 'dotenv';

dotenv.config();

export const CONSTANTS = {
  MONGO_URI: process.env.MONGO_URI || '',
  PORT: process.env.PORT || 3000,
  JWT_KEY: process.env.JWT_KEY || 'secret',
};
