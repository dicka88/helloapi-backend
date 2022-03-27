import { faker } from '@faker-js/faker';
import * as mongoose from 'mongoose';
import envConfig from '../config/env';
import { hash } from '../utils/hash';

import User, { LoginType } from '../app/models/User';

const generateUser = () => {
  const name = faker.name.firstName();

  return {
    name,
    email: faker.unique(faker.internet.email),
    emailVerifiedAt: faker.date.between('2022-01-01', '2022-03-31'),
    password: hash(name),
    resetPassword: null,
    avatarUrl: null,
    loginType: LoginType.EMAIL,
  };
};

const user = generateUser();

mongoose.connect(envConfig.MONGODB_URL).then(async () => {
  console.log('Mongodb connected');
  await User.create(user);

  console.log('Succes seed user');

  process.exit();
});
