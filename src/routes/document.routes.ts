import { FastifyPluginAsync } from 'fastify';
import authMiddleware from '../app/middlewares/auth.middleware';
import {
  getAllDocument,
  getDocument,
  putDocument,
  postDocument,
  deleteDocument,
  postPublicDocument,
  getPublicDocument,
  putPublicDocument,
} from '../app/controllers/document.controller';

const auth = {
  preHandler: [authMiddleware],
};

const routes: FastifyPluginAsync = async (app): Promise<void> => {
  app.post('/', auth, postDocument);
  app.get('/', auth, getAllDocument);
  app.get('/:id', auth, getDocument);
  app.put('/:id', auth, putDocument);
  app.delete('/:id', auth, deleteDocument);

  app.post('/public', {}, postPublicDocument);
  app.get('/public/:id', {}, getPublicDocument);
  app.put('/public/:id', {}, putPublicDocument);
};

export default routes;
