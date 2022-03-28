import { FastifyReply } from 'fastify';

import { FastifyRequestAuth, JWTCredential } from '../middlewares/auth.middleware';
import Project from '../models/Project';

const md5 = require('md5');

/**
 * Done: yes
 * Testing: yes
 */
export const getAllProject = async (request: FastifyRequestAuth, reply: FastifyReply) => {
  const { id } = request.user as JWTCredential;

  const projects = await Project.find({ userId: id }).select('-endpoints');

  reply.send({
    code: 200,
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

    const project = await Project.findOne({ userId: id, prefixPath }).select('-endpoints');

    return reply.send(project);
  } catch (err: any) {
    return reply.send({
      code: 500,
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

  const prefixPath = md5(`${name}${Date.now()}`);
  const apiKey = md5(`${prefixPath}${Date.now()}`);

  const project = new Project({
    userId: id,
    projectName: name,
    projectDescription: description,
    prefixPath,
    apiKey,
  });

  await project.save();

  reply.send({
    project,
  });
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
  const { name } = request.body;

  try {
    const project = await Project.findOne({ prefixPath });

    if (project.userId.toString() !== id) {
      return reply.code(401).send({
        code: 401,
        message: 'Unauthorize to update this project',
      });
    }

    await Project.findByIdAndUpdate(project.id, {
      projectName: name,
    });

    return reply.send({ code: 200, message: 'update project' });
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
    await Project.deleteOne({
      userId: id,
      prefixPath,
    });

    return reply.send({ code: 200, message: 'Delete project success' });
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
    code: 200,
    apiKey,
  });
};
