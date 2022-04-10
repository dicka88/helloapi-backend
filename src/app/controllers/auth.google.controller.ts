import { FastifyReply } from 'fastify';
import { OAuth2Client } from 'google-auth-library';
import { jwtSign } from '../../utils/jwt';

import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../../config/env';
import User, { UserInterface } from '../models/User';

const authClient = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);

export const googleSignin = async (request: any, reply: FastifyReply) => {
  const { tokenId } = request.body;

  try {
    const loginTicket = await authClient.verifyIdToken({
      idToken: tokenId,
    });
    const payload = loginTicket.getPayload()!;

    // payload.sub is unique identifier for user
    const user = await User.findOne<UserInterface>({ 'oauth.google.id': payload.sub });

    if (!user) {
      return reply.code(401).send({
        statusCode: 401,
        message: 'User is not registered',
      });
    }

    const token = jwtSign({
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
      email: user.email,
      emailVerifiedAt: user.emailVerifiedAt,
    });

    return reply.send({
      statusCode: 200,
      token,
    });
  } catch (err: any) {
    return reply.status(500).send({
      statusCode: 500,
      error: err.message,
    });
  }
};

export const googleSignup = async (request: any, reply: FastifyReply) => {
  const { tokenId } = request.body;

  try {
    const loginTicket = await authClient.verifyIdToken({
      idToken: tokenId,
    });
    const payload = loginTicket.getPayload()!;

    // payload.sub is unique identifier for user
    const user = await User.findOne<UserInterface>({ 'oauth.google.id': payload.sub });

    if (user) {
      return reply.code(401).send({
        statusCode: 401,
        message: 'User already registered',
      });
    }

    const newUser = await User.create({
      name: payload.name,
      email: null,
      avatarUrl: payload.picture,
      oauth: {
        google: {
          id: payload.sub,
          name: payload.name,
          email: payload.email,
          avatar: payload.picture,
        },
      },
    });

    const token = jwtSign({
      id: newUser.id,
      name: newUser.name,
      avatarUrl: newUser.avatarUrl,
      email: newUser.email,
      emailVerifiedAt: newUser.emailVerifiedAt,
    });

    return reply.send({
      statusCode: 200,
      token,
    });
  } catch (err: any) {
    return reply.status(500).send({
      statusCode: 500,
      error: err.message,
    });
  }
};
