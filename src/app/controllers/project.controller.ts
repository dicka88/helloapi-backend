import { FastifyReply } from 'fastify';

import { FastifyRequestAuth, JWTCredential } from '../middlewares/auth.middleware';
import Project from '../models/Project';

const md5 = require('md5');
const shorthash = require('short-hash');

/**
 * Done: yes
 * Testing: yes
 */
export const getAllProject = async (request: FastifyRequestAuth, reply: FastifyReply) => {
  const { id } = request.user as JWTCredential;

  const projects = await Project.find({ userId: id }).select('-endpoints -apiKey');

  reply.send({
    statusCode: 200,
    data: projects,
  });
};

/**
 * Done: yes
 * Testing: yes
 */
export const getProject = async (request: any, reply: FastifyReply) => {
  try {
    const { id } = request.user as JWTCredential;
    const { prefixPath } = request.params;

    const project = await Project.findOne({ userId: id, prefixPath });

    if (!project) {
      return reply.code(404).send({
        statusCode: 404,
        message: 'Project is not found',
      });
    }

    return reply.send(project);
  } catch (err: any) {
    return reply.send({
      statusCode: 500,
      message: err.message,
    });
  }
};

/**
 * Done: yes
 * Testing: yes
 */
export const createProject = async (
  request: any,
  reply: FastifyReply,
) => {
  const { id } = request.user as JWTCredential;
  const { name, description } = request.body;

  const prefixPath = shorthash(`${name}${Date.now()}`);
  const apiKey = md5(`${prefixPath}${Date.now()}`);

  try {
    const project = await Project.create({
      userId: id,
      projectName: name,
      projectDescription: description,
      prefixPath,
      apiKey,
      endpoints: [],
    });

    return reply.code(201).send(project);
  } catch (err: any) {
    return reply.code(500).send({
      statusCode: 500,
      message: err.message,
    });
  }
};

/**
 * Done: yes
 * Testing: yes
 */
export const updateProject = async (
  request: any,
  reply: FastifyReply,
) => {
  const { id } = request.user as JWTCredential;
  const { prefixPath } = request.params;
  const { name, description } = request.body;

  try {
    const project = await Project.findOne({ prefixPath });

    if (project.userId.toString() !== id) {
      return reply.code(401).send({
        statusCode: 401,
        message: 'Unauthorize to update this project',
      });
    }

    await Project.findByIdAndUpdate(project.id, {
      projectName: name,
      projectDescription: description,
    });

    return reply.send({ statusCode: 200, message: 'update project' });
  } catch (err) {
    return reply.code(404).send({
      message: 'Project is not found',
    });
  }
};

/**
 * Done: yes
 * Testing: yes
 */
export const deleteProject = async (
  request: any,
  reply: FastifyReply,
) => {
  const { id } = request.user as JWTCredential;
  const { prefixPath } = request.params;

  try {
    const deleted = await Project.deleteOne({
      userId: id,
      prefixPath,
    });

    if (deleted.deletedCount === 0) {
      return reply.code(404).send({
        statusCode: 404,
        message: 'Project is not found',
      });
    }

    return reply.send({ statusCode: 200, message: 'Delete project success' });
  } catch (err) {
    return reply.code(400).send({
      message: "Project doesn't exist",
    });
  }
};

/**
 * Done: yes
 * Testing: yes
 */
export const generateKey = async (request: any, replay: FastifyReply) => {
  const { id } = request.user as JWTCredential;
  const { prefixPath } = request.params;

  const apiKey = md5(`${prefixPath}${Date.now()}`);

  await Project.findOneAndUpdate({ id, prefixPath }, {
    apiKey,
  });

  return replay.send({
    statusCode: 200,
    apiKey,
  });
};
