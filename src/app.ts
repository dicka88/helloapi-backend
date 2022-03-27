import fastify from 'fastify';
// import fastyMongdb from 'fastify-mongodb';
import * as mongoose from 'mongoose';

import envConfig from './config/env';

import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import apiRoutes from './routes/apiRoutes';

const build = (props = {}) => {
  const app = fastify(props);

  // mongodb plugin setup
  // app.register(fastyMongdb, {
  //   forceClose: true,
  //   url: envConfig.MONGODB_URL,
  // });

  mongoose.connect(envConfig.MONGODB_URL).then(() => {
    console.log('Mongodb connected');
  });

  app.get<Object>('/', async () => ({
    message: 'Its work',
  }));

  app.register(authRoutes, { prefix: '/auth' });
  app.register(userRoutes, { prefix: '/user' });
  app.register(apiRoutes, { prefix: '/api' });

  app.get('*', async (request, replay) => replay.code(404).send({
    code: 404,
    message: 'Resource is not found',
  }));

  return app;
};

export default build;
