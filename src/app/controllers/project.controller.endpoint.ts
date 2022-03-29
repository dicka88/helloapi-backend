import { FastifyReply } from 'fastify';
import * as _ from 'lodash';

import Project, { Endpoint } from '../models/Project';

/**
 * Done: ok
 * Testing: ok
 */
export const createEndpoint = async (request: any, reply: FastifyReply) => {
  const { id } = request.user;
  const { prefixPath } = request.params;
  const {
    name,
    description,
    method,
    path,
    type = 'json',
    schema,
    data,
  } = request.body;

  try {
    const existEndpoint = await Project.exists({
      userId: id,
      prefixPath,
      'endpoints.path': path,
    });

    if (existEndpoint) {
      return reply.code(400).send({
        code: 400,
        message: 'Endpoint with path already exists',
      });
    }

    await Project.updateOne({ prefixPath, userId: id }, {
      $addToSet: {
        endpoints: {
          name,
          description,
          method,
          path,
          type,
          schema,
          data,
        },
      },
    });

    return reply.code(201).send({
      code: 200,
      message: 'Success added endpoint',
      endpoint: {
        name,
        description,
        method,
        path,
        type,
        schema,
        data,
      },
    });
  } catch (err) {
    return reply.code(400).send(err);
  }
};

/**
 * Done: ok
 * Testing: ok
 */
export const getEndpoint = async (request: any, reply: FastifyReply) => {
  const { id } = request.user;
  const { prefixPath, path } = request.params;

  try {
    const project = await Project.findOne({
      userId: id,
      prefixPath,
      'endpoints.path': path,
    });

    if (!project) throw new Error('Endpoint is not found');

    const endpoint = project.endpoints.find((item: Endpoint) => item.path === path);

    return reply.code(200).send(endpoint);
  } catch (err: any) {
    return reply.code(400).send({
      code: 400,
      message: err.message,
    });
  }
};

/**
 * Done: ok
 * Testing: ok
 */
export const updateEndpoint = async (request: any, reply: FastifyReply) => {
  const { id } = request.user;
  const { prefixPath, path } = request.params;
  const {
    name,
    description,
    method,
    path: newPath,
    type,
    schema,
    data,
  } = request.body;

  // Just update htat user requested
  const updateFilter = _.pickBy({
    'endpoints.$.name': name,
    'endpoints.$.description': description,
    'endpoints.$.method': method,
    'endpoints.$.path': newPath,
    'endpoints.$.type': type,
    'endpoints.$.schema': schema,
    'endpoints.$.data': data,
  });

  try {
    await Project.updateOne({
      userId: id,
      prefixPath,
      'endpoints.path': path,
    }, {
      $set: updateFilter,
    });

    return reply.send({
      code: 200,
      message: 'Endpoint updated',
    });
  } catch (err: any) {
    return reply.code(400).send({
      message: "Can't update endpoint",
    });
  }
};

/**
 * Done: ok
 * Testing: no
 */
export const deleteEndpoint = async (request: any, reply: FastifyReply) => {
  const { id } = request.user;
  const { prefixPath, path } = request.params;

  await Project.deleteOne({
    userId: id,
    prefixPath,
    'endpoints.path': path,
  });

  return reply.send({
    code: 200,
    message: 'Endpoint has been deleted',
  });
};
