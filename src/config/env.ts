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
  JWT_SECRET,
  MONGODB_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  IMGBB_API_KEY,
} = process.env;

export default envConfig;
