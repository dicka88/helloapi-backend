import { FastifyReply, FastifyRequest } from 'fastify';
import * as _ from 'lodash';
import * as mongoose from 'mongoose';

import jsonToFaker from '../../utils/jsonToFaker';
import Project, { ProjectInterface, Endpoint, EndpointSchema } from '../models/Project';
import Document, { DocumentInterface } from '../models/Document';

type ApiRequest = FastifyRequest<{
  Params: {
    prefixPath: string;
    path: string
  },
  Body: {
    payload: any
  }
}>

export const getDocumentHandler = async (request: any, reply: FastifyReply): Promise<void> => {
  const { id } = request.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return reply.code(400).send({
      code: '400',
      error: 'Invalid id',
    });
  }

  const document = await Document.findById(id) as DocumentInterface;

  if (!document) {
    reply.code(404).send({
      message: 'Document not found',
    });
  }
  reply.code(200).send(document.content);
};

export const getHandler = async (request: ApiRequest, reply: FastifyReply) => {
  const { prefixPath, path } = request.params;
  const filter = {
    prefixPath,
    'endpoints.path': path,
  };

  try {
    const project = await Project.findOneAndUpdate(filter, {
      $inc: {
        hitTotal: 1,
        'endpoints.$.hit': 1,
      },
    }) as ProjectInterface;

    const endpoint = project.endpoints.find((item: Endpoint) => item.path === path) as Endpoint;

    if (!endpoint) throw new Error('Endpoint not found');

    // if type is json then send json
    if (endpoint.type === 'json' && typeof endpoint.data === 'string') {
      const json = JSON.parse(endpoint.data as string);

      return reply.send(json);
    }

    // if type is faker then generate data with faker
    if (endpoint.type === 'faker') {
      const { schema } = endpoint;

      let schemaParsed = {};

      if (Array.isArray(schema)) {
        schemaParsed = _.chain(schema).keyBy('key').mapValues('value').value() as EndpointSchema;
      } else {
        schemaParsed = schema;
      }

      // make an array
      if (endpoint.count > 0) {
        const json = Array.from({ length: endpoint.count }, () => jsonToFaker(schemaParsed));

        return reply.send(json);
      }

      // make a single object
      const json = jsonToFaker(schemaParsed);

      return reply.send(json);
    }

    return reply.send(endpoint.data);
  } catch (err) {
    return reply.code(404).send({
      message: 'Resource is not found',
    });
  }
};

// Upcoming features
export const postHandler = async (request: ApiRequest, reply: FastifyReply) => {
  const { prefixPath, path } = request.params;

  try {
    const filter = {
      prefixPath,
      'endpoints.path': path,
    };

    return reply.send({
      message: 'Hello',
    });
  } catch (err) {
    return reply.code(404).send({
      message: 'Resource is not found',
    });
  }
};

// Upcoming Features
export const putHandler = async (request: ApiRequest, reply: FastifyReply) => {
  const { prefixPath, path } = request.params;
  const { payload } = request.body;

  // Should validate payload

  try {
    const filter = {
      prefixPath,
      'endpoints.path': path,
    };

    const api = await Project.findOne(filter);
    const endpoint = api.endpoints.find((item: Endpoint) => item.path === path);

    const dataJson = JSON.parse(endpoint.data);
    const mergeData = { ...dataJson, ...payload };

    console.log({ mergeData });

    await Project.findOneAndUpdate(filter, {
      $set: {
        'endpoints.$.data': JSON.stringify(mergeData),
      },
    });

    return reply.send({
      message: 'Updated',
    });
  } catch (err) {
    return reply.code(404).send({
      message: 'Resource is not found',
    });
  }
};

// Upcoming Features
export const deleteHandler = async (request: ApiRequest, reply: FastifyReply) => {
  const { prefixPath, path } = request.params;

  try {
    return reply.send({
      prefixPath, path,
    });
  } catch (err) {
    return reply.code(404).send({
      message: 'Resource is not found',
    });
  }
};
