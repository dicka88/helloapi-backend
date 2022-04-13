import type { FastifyPluginAsync } from 'fastify';

import {
  createEndpoint, deleteEndpoint, getEndpoint, updateEndpoint,
} from '../app/controllers/project.endpoints.controller';
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

  app.post('/:prefixPath/endpoint', {
    ...auth,
    schema: {
      body: {
        type: 'object',
        required: ['name', 'path', 'type'],
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          path: { type: 'string' },
          count: { type: 'number' },
          type: { type: 'string', enum: ['json', 'faker'] },
          schema: { type: 'array' },
          data: { type: 'object' },
        },
      },
    },
  }, createEndpoint);
  app.get('/:prefixPath/endpoint/:path', auth, getEndpoint);
  app.put('/:prefixPath/endpoint/:path', {
    ...auth,
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          path: { type: 'string' },
          count: { type: 'number' },
          type: { type: 'string', enum: ['json', 'faker'] },
          schema: { type: 'array' },
          data: { type: 'object' },
        },
      },
    },
  }, updateEndpoint);
  app.delete('/:prefixPath/endpoint/:path', auth, deleteEndpoint);
};

export default routes;
