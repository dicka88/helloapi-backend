import {
  sign,
  verify,
} from 'jsonwebtoken';
import env from '../config/env';

export const jwtSign = (data: object) => sign(data, env.JWT_SECRET, { expiresIn: '30d' });

export const jwtVerify = (token: string) => verify(token, env.JWT_SECRET);
