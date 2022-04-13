import {
  describe, it, before, after,
} from 'mocha';
import faker from '@faker-js/faker';
import { expect } from 'chai';

import User from '../app/models/User';
import app from '../app';

describe('Auth testing', () => {
  let mock: any = null;

  before(async () => {
    mock = await app();
  });

  const name: string = faker.unique(faker.name.findName);
  const email: string = faker.unique(faker.internet.email);
  const password: string = faker.internet.password();
  const retypePassword: string = password;

  describe('POST /auth/signup', () => {
    it('Should return 400 -> Registered with invalid form', async () => {
      const response = await mock.inject({
        method: 'POST',
        url: '/auth/signup',
        payload: {
          retypePassword: 'gggogogog',
        },
      });

      expect(response.statusCode).to.equal(400);
      expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
      expect(JSON.parse(response.body)).to.have.property('message');
    });

    it('Should return 201 -> Register new user', async () => {
      const response = await mock.inject({
        method: 'POST',
        url: '/auth/signup',
        payload: {
          name,
          email,
          password,
          retypePassword,
        },
      });

      expect(response.statusCode).to.equal(201);
      expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
      expect(JSON.parse(response.body)).to.have.property('token');
    });

    it('Should return 409 -> Register with existing user', async () => {
      const response = await mock.inject({
        method: 'POST',
        url: '/auth/signup',
        payload: {
          name,
          email,
          password,
          retypePassword,
        },
      });

      expect(response.statusCode).to.equal(409);
      expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
      expect(JSON.parse(response.body)).to.have.property('message');
    });
  });

  describe('POST /auth/signin', () => {
    it('Should return 404 -> Signin with unregistered email', async () => {
      const response = await mock.inject({
        method: 'POST',
        url: '/auth/signin',
        payload: {
          email: 'iamnotregisteredmail@cadad.com',
          password: 'gggogogog',
        },
      });

      expect(response.statusCode).to.equal(404);
      expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
      expect(JSON.parse(response.body)).to.have.property('message');
    });

    it('Should return 401 -> Signin with wrong password', async () => {
      const response = await mock.inject({
        method: 'POST',
        url: '/auth/signin',
        payload: {
          email,
          password: 'iamwrongpassword',
        },
      });

      expect(response.statusCode).to.equal(401);
      expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
      expect(JSON.parse(response.body)).to.have.property('message');
    });

    it('Should return 200 -> Signin with registred email and password', async () => {
      const response = await mock.inject({
        method: 'POST',
        url: '/auth/signin',
        payload: {
          email,
          password,
        },
      });

      expect(response.statusCode).to.equal(200);
      expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
      expect(JSON.parse(response.body)).to.have.property('token');
    });
  });

  // After test should be removed
  after(async () => {
    await User.deleteOne({ email });
  });
});
