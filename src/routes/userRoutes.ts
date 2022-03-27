import type { FastifyPluginAsync } from 'fastify';

const routes: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            pong: {
              type: 'string',
            },
          },
        },
      },
    },
  }, async () => ({ pong: 'it worked!' }));
};

export default routes;
