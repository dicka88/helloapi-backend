import { FastifyReply, FastifyRequest } from 'fastify';
import { jwtVerify } from '../../utils/jwt';

export type JWTCredential = {
  id: string,
  name: string,
  email: string,
  iat: number,
  exp: number,
}

export interface FastifyRequestAuth extends FastifyRequest {
  user?: JWTCredential
}

const authMiddleware = (req: FastifyRequestAuth, rep: FastifyReply, next: Function) => {
  const { authorization } = req.headers;

  // Middleware verify token
  try {
    if (!authorization) throw new Error('Token not found');
    const token = authorization.split(' ')[1];
    const credential = jwtVerify(token) as JWTCredential;

    req.user = credential;

    return next();
  } catch (err) {
    return rep.code(401).send({
      code: 401,
      message: 'Unauthorized',
    });
  }
};

export default authMiddleware;
