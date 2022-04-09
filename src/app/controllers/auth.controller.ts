import { FastifyReply, FastifyRequest } from 'fastify';
import { hash, compare } from '../../utils/hash';

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
      statusCode: 404,
      message: "User with email isn't registered",
    });
  }

  const isMatch = compare(password, user.password);

  if (!isMatch) {
    return replay.code(401).send({
      statusCode: 401,
      message: 'Email or password is incorrect',
    });
  }

  const credential = {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerifiedAt: user.emailVerifiedAt,
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
      statusCode: 409,
      message: 'User with email already exists',
    });
  }

  try {
    const hashedPassword = hash(password);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwtSign({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerifiedAt: user.emailVerifiedAt,
    });

    return replay.send({
      token,
    });
  } catch (err: any) {
    return replay.code(400).send({
      statusCode: 400,
      message: err.message,
    });
  }
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
