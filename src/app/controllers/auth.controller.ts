import { FastifyReply, FastifyRequest } from 'fastify';

import { jwtSign, jwtVerify } from '../../utils/jwt';
import User from '../models/User';

type SigninRequest = FastifyRequest<{
  Body: {
    email: string;
    password: string;
  }
}>

type SignupRequest = FastifyRequest<{
  Body: {
    name: string;
    email: string;
    password: string;
  }
}>

type VerifyRequest = FastifyRequest<{
  Body: {
    token: string
  }
}>

export const signin = async (request: SigninRequest, replay: FastifyReply) => {
  const { email, password } = request.body;

  const user = await User.findOne({ email });

  if (!user) {
    return replay.code(404).send({
      code: 404,
      message: 'User not is found',
    });
  }

  const isMatch = user.password === password;

  if (!isMatch) {
    return replay.code(401).send({
      code: 401,
      message: 'Email or password is incorrect',
    });
  }

  const credential = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  const token = jwtSign(credential);

  return replay.send({
    credential,
    token,
  });
};

export const signup = async (request: SignupRequest, replay: FastifyReply) => {
  const { name, email, password } = request.body;

  const user = await User.findOne({ email });

  if (user) {
    return replay.code(409).send({
      message: 'User already exists',
    });
  }

  const newUser = new User({
    name,
    email,
    password,
  });

  await newUser.save();

  const token = jwtSign({
    name: newUser.name,
    email,
  });

  const decoded = jwtVerify(token);

  console.log(decoded);

  return replay.send({
    token,
  });
};

export const verify = async (request: VerifyRequest, replay: FastifyReply) => {
  const { token } = request.body;

  try {
    const decoded = jwtVerify(token);

    return replay.send(decoded);
  } catch (err) {
    return replay.code(401).send({
      message: 'Token is not valid',
    });
  }
};
