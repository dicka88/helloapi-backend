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

export const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} = process.env;

export default envConfig;
