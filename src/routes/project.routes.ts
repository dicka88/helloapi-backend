import type { FastifyPluginAsync } from 'fastify';

import {
  createEndpoint, deleteEndpoint, getEndpoint, updateEndpoint,
} from '../app/controllers/project.controller.endpoint';
import authMiddleware from '../app/middlewares/auth.middleware';
import {
  getAllProject, getProject, updateProject, deleteProject, createProject, generateKey,
} from '../app/controllers/project.controller';

const auth = {
  preHandler: [authMiddleware],
};

const routes: FastifyPluginAsync = async (app): Promise<void> => {
  app.get('/', auth, getAllProject);
  app.get('/:prefixPath', auth, getProject);
  app.post('/', {
    ...auth,
    schema: {
      body: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
        },
      },
    },
  }, createProject);
  app.post('/:prefixPath/generate_key', auth, generateKey);
  app.put('/:prefixPath', {
    ...auth,
    schema: {
      body: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
        },
      },
    },
  }, updateProject);
  app.delete('/:prefixPath', auth, deleteProject);

  app.post('/:prefixPath/endpoint', auth, createEndpoint);
  app.get('/:prefixPath/endpoint/:path', auth, getEndpoint);
  app.put('/:prefixPath/endpoint/:path', auth, updateEndpoint);
  app.delete('/:prefixPath/endpoint/:path', auth, deleteEndpoint);
};

export default routes;
