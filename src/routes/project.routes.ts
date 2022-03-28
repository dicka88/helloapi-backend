import type { FastifyPluginAsync } from 'fastify';

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
  app.post('/:prefixPath', auth, createProject);
  app.post('/:prefixPath/generate_key', auth, generateKey);
  app.put('/:prefixPath', auth, updateProject);
  app.delete('/:prefixPath', auth, deleteProject);
};

export default routes;
