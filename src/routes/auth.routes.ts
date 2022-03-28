import { FastifyPluginAsync } from 'fastify';
import { signin, signup, verify } from '../app/controllers/auth.controller';

const routes: FastifyPluginAsync = async (app): Promise<void> => {
  app.post('/signin', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string' },
          password: { type: 'string' },
        },
      },
    },
  }, signin);

  app.post('/signup', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password', 'retypePassword'],
        properties: {
          email: { type: 'string' },
          password: { type: 'string' },
          retypePassword: { type: 'string' },
        },
      },
    },
  }, signup);

  app.post('/verify', {}, verify);
};

export default routes;