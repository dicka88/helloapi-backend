import { FastifyPluginAsync } from 'fastify';
import {
  getHandler, postHandler, putHandler, deleteHandler,
} from '../app/controllers/api.controller';

const routes: FastifyPluginAsync = async (app): Promise<void> => {
  app.get('/:prefixPath/:path', {}, getHandler);
  // app.post('/:prefixPath/:path', {}, postHandler);
  // app.put('/:prefixPath/:path', {}, putHandler);
  // app.delete('/:prefixPath/:path', {}, deleteHandler);
};

export default routes;
