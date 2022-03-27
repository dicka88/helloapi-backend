import { config } from 'dotenv';

config();

export type Env = {
  JWT_SECRET?: string;
  MONGODB_URL?: string;
}

const envConfig = {
  JWT_SECRET: process.env.JWT_SECRET!,
  MONGODB_URL: process.env.MONGODB_URL!,
};

export default envConfig;
