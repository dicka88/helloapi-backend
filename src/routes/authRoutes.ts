import { FastifyPluginAsync } from 'fastify';
import { signin, signup, verify } from '../app/controllers/AuthController';

const routes: FastifyPluginAsync = async (app): Promise<void> => {
  app.post('/signin', {}, signin);
  app.post('/signup', {}, signup);
  app.post('/verify', {}, verify);
};

export default routes;
