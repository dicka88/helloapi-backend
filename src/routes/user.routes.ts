import type { FastifyPluginAsync } from 'fastify';
import { getUser, putUser } from '../app/controllers/user.controller';
import authMiddleware from '../app/middlewares/auth.middleware';

const auth = {
  preValidation: authMiddleware,
};

const routes: FastifyPluginAsync = async (app): Promise<void> => {
  app.get('/profile', auth, getUser);
  app.put<{
    Body: {
      name: string
    }
  }>('/profile', auth, putUser);
};

export default routes;
