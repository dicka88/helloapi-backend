import { FastifyReply, FastifyRequest } from 'fastify';
import { hash } from '../../utils/hash';
import { FastifyRequestAuth, JWTCredential } from '../middlewares/auth.middleware';
import User, { UserInterface } from '../models/User';

export const getUser = async (request: FastifyRequestAuth, reply: FastifyReply) => {
  const { id } = request.user as JWTCredential;

  const user = await User.findById(id).select('-password') as UserInterface;

  reply.send(user);
};

interface FastifyUserRequest extends FastifyRequestAuth {
  body: {
    name: string,
  }
}

/**
 * Update
 * name
 * password
 *
 * @param request FastifyRequest
 * @param reply  FastifyReply
 * @returns reply
 */
export const putUser = async (
  request: FastifyUserRequest,
  reply: FastifyReply,
) => {
  const { id } = request.user as JWTCredential;
  const { name } = request.body;

  await User.findByIdAndUpdate(id, {
    name,
  });

  reply.send({
    id,
    name,
    message: 'Its work',
  });
};

type FastifyChangePassword = FastifyRequest<{
  Body: {
    password: string,
    passwordConfirmation: string
  }
}>

export const changePassword = async (request: FastifyChangePassword, reply: FastifyReply) => {
  const { password, passwordConfirmation } = request.body;

  if (password !== passwordConfirmation) {
    return reply.code(400).send({
      code: 400,
      message: 'Password confirmation is not same',
    });
  }

  const hashedPassword = hash(password);

  await User.findByIdAndUpdate(id, {
    password: hashedPassword,
  });

  return reply.send({
    code: 200,
    message: 'Password has been changed',
  });
};

type FastifyRequestBind = FastifyRequest<{
  Body: {
    token: string
  }
}>

export const bindGoogle = async (request: FastifyRequestBind, reply: FastifyReply) => {
  // make an api call too google and verified of token
  const { token } = request.body;

  // validate token with google library

  return reply.send({
    message: 'Its works',
  });
};

export const bindGithub = async (request: FastifyRequestBind, reply: FastifyReply) => {
  const { token } = request.body;
  return reply.send({
    message: 'Its works',
  });
};
