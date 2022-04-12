import fastify from 'fastify';
// import fastyMongdb from 'fastify-mongodb';
import * as mongoose from 'mongoose';
import fastifyCors from 'fastify-cors';

import envConfig from './config/env';

import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import apiRoutes from './routes/api.routes';
import projectRoutes from './routes/project.routes';
import documentRoutes from './routes/document.routes';

const build = async (props = {}) => {
  const app = fastify(props);

  // CORS
  app.register(fastifyCors, {
    origin: '*',
  });

  // mongodb plugin setup
  // app.register(fastyMongdb, {
  //   forceClose: true,
  //   url: envConfig.MONGODB_URL,
  // });

  await mongoose.connect(envConfig.MONGODB_URL);

  app.get<Object>('/', async () => ({
    message: 'Its work',
  }));

  app.register(authRoutes, { prefix: '/auth' });
  app.register(userRoutes, { prefix: '/user' });
  app.register(apiRoutes, { prefix: '/api' });
  app.register(documentRoutes, { prefix: '/documents' });
  app.register(projectRoutes, { prefix: '/project' });

  app.get('*', async (request, replay) => replay.code(404).send({
    statusCode: 404,
    message: 'Resource is not found',
  }));

  return app;
};

export default build;
