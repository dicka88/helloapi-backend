import { FastifyPluginAsync } from 'fastify';
import { signin, signup, verify } from '../app/controllers/auth.controller';
import { googleSignin, googleSignup } from '../app/controllers/auth.google.controller';

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
        required: ['name', 'email', 'password', 'retypePassword'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string' },
          password: { type: 'string' },
          retypePassword: { type: 'string' },
        },
      },
    },
  }, signup);

  app.post('/verify', {}, verify);

  app.post('/google/signin', {}, googleSignin);
  app.post('/google/signup', {}, googleSignup);

  app.post('/github/signin', {}, (app) => {});
  app.post('/github/signup', {}, (app) => {});
};

export default routes;
