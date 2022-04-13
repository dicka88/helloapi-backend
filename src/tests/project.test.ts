import faker from '@faker-js/faker';
import {
  after, before, describe, it,
} from 'mocha';
import { expect } from 'chai';
import { FastifyInstance } from 'fastify';

import { ObjectId } from 'fastify-mongodb';
import app from '../app';
import User from '../app/models/User';
import Project from '../app/models/Project';

describe('Test Project', () => {
  const projectsId: string[] = [];
  let mock: FastifyInstance;
  const email: string = faker.unique(faker.internet.email);
  let jwtToken: string;
  let projectPrefixPath: string;
  let endpointPath: string;

  before(async () => {
    mock = await app();

    const password = faker.internet.password();
    const { body } = await mock.inject({
      method: 'POST',
      url: '/auth/signup',
      payload: {
        name: 'Hello API',
        email,
        password,
        retypePassword: password,
      },
    });

    const json = JSON.parse(body);
    jwtToken = json.token;
  });

  describe('GET /project', () => {
    it('Should return 401 -> Unauthorized', async () => {
      const { body, statusCode } = await mock.inject({
        method: 'GET',
        url: '/project',
      });

      expect(statusCode).to.equal(401);
      const json = JSON.parse(body);
      expect(json).to.have.property('statusCode');
      expect(json).to.have.property('message');
    });

    it('Should return 200 -> data length is 0', async () => {
      const { body, statusCode } = await mock.inject({
        method: 'GET',
        url: '/project',
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      });

      const json = JSON.parse(body);

      expect(statusCode).to.equal(200);
      expect(json).to.have.property('statusCode');
      expect(json).to.have.property('data');
      expect(json.data).to.have.lengthOf(0);
    });

    it('Should return 200 -> data length is greater than 0', async () => {
      const { json: project } = await mock.inject({
        method: 'POST',
        url: '/project',
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
        payload: {
          name: 'My Project',
          description: 'just an my projects',
        },
      });

      projectsId.push(project()._id);

      const { body, statusCode } = await mock.inject({
        method: 'GET',
        url: '/project',
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      });

      const json = JSON.parse(body);

      expect(statusCode).to.equal(200);
      expect(json).to.have.property('statusCode');
      expect(json).to.have.property('data');
      expect(json.data).to.have.length.above(0);
    });
  });

  describe('POST /project', () => {
    it('Should return 401 -> Unauthorized', async () => {
      const { body, statusCode } = await mock.inject({
        method: 'POST',
        url: '/project',
        payload: {
          name: 'Unauthorized',
          description: 'just an my projects',
        },
      });

      expect(statusCode).to.equal(401);
      const json = JSON.parse(body);
      expect(json).to.have.property('statusCode');
      expect(json).to.have.property('message');
    });

    it('Should return 400 -> Invalid form', async () => {
      const { body, statusCode } = await mock.inject({
        method: 'POST',
        url: '/project',
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
        payload: {
          description: 'just an my projects',
        },
      });

      expect(statusCode).to.equal(400);
      const json = JSON.parse(body);
      expect(json).to.have.property('statusCode');
      expect(json).to.have.property('message');
    });

    it('Should return 201 -> Success', async () => {
      const { body, statusCode } = await mock.inject({
        method: 'POST',
        url: '/project',
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
        payload: {
          name: 'My Project',
          description: 'just an my projects',
        },
      });

      expect(statusCode).to.equal(201);
      const json = JSON.parse(body);
      expect(json).to.have.property('_id');
      expect(json).to.have.property('projectName');
      expect(json).to.have.property('projectDescription');
      expect(json).to.have.property('prefixPath');
      expect(json).to.have.property('apiKey');
      expect(json.projectName).to.equal('My Project');
      expect(json.projectDescription).to.equal('just an my projects');

      // set temp variable
      projectsId.push(json._id);
      projectPrefixPath = json.prefixPath;
    });
  });

  describe('GET /project/:prefixPath', () => {
    it('Should return 401 -> Unauthorized', async () => {
      const { body, statusCode } = await mock.inject({
        method: 'GET',
        url: `/project/${projectPrefixPath}`,
      });

      expect(statusCode).to.equal(401);
      const json = JSON.parse(body);
      expect(json).to.have.property('statusCode');
      expect(json).to.have.property('message');
    });

    it('Should return 404 -> Not found', async () => {
      const fakeId = new ObjectId(929329).toString();
      const { statusCode, json } = await mock.inject({
        method: 'GET',
        url: `/project/${fakeId}`,
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      });

      expect(statusCode).to.equal(404);
      expect(json()).to.be.an('object');
      expect(json()).to.have.property('statusCode');
      expect(json()).to.have.property('message');
    });

    it('Should return 200 -> project', async () => {
      const { json, statusCode } = await mock.inject({
        method: 'GET',
        url: `/project/${projectPrefixPath}`,
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      });

      expect(statusCode).to.equal(200);
      expect(json()).to.be.an('object');
      expect(json()).to.have.property('_id');
      expect(json()).to.have.property('projectName');
      expect(json()).to.have.property('projectDescription');
      expect(json()).to.have.property('prefixPath');
      expect(json()).to.have.property('userId');
      expect(json()).to.have.property('apiKey');
      expect(json()).to.have.property('endpoints');
    });
  });

  describe('PUT /project', () => {
    it('Should return 401 -> Unauthorized', async () => {
      const { body, statusCode } = await mock.inject({
        method: 'PUT',
        url: `/project/${projectPrefixPath}`,
        payload: {
          name: 'Unauthorized',
          description: 'just an my projects',
        },
      });

      expect(statusCode).to.equal(401);
      const json = JSON.parse(body);
      expect(json).to.have.property('statusCode');
      expect(json).to.have.property('message');
    });
    it('Should return 400 -> Invalid form', async () => {
      const { json, statusCode } = await mock.inject({
        method: 'PUT',
        url: `/project/${projectPrefixPath}`,
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
        payload: {
          description: 'just an my projects',
        },
      });

      expect(statusCode).to.equal(400);
      expect(json()).to.have.property('statusCode');
      expect(json()).to.have.property('message');
    });
    it('Should return 200 -> Success', async () => {
      const { json, statusCode } = await mock.inject({
        method: 'PUT',
        url: `/project/${projectPrefixPath}`,
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
        payload: {
          name: 'My Project Updated',
          description: 'just an my projects',
        },
      });

      expect(statusCode).to.equal(200);
      expect(json()).to.have.property('statusCode');
      expect(json()).to.have.property('message');
    });
  });

  describe('POST /project/endpoint', () => {
    const validPayload = {
      name: 'Unauthorized',
      description: 'just an my projects',
      path: 'test',
      type: 'json',
      data: {
        statusCode: 200,
      },
    };

    const invalidPayload = {
      name: 'Hello',
    };

    it('Should return 401 -> unauthorized', async () => {
      const { body, statusCode } = await mock.inject({
        method: 'POST',
        url: `/project/${projectPrefixPath}/endpoint`,
        payload: validPayload,
      });

      expect(statusCode).to.equal(401);
      const json = JSON.parse(body);
      expect(json).to.have.property('statusCode');
      expect(json).to.have.property('message');
    });

    it('Should return 400 -> Invalid request', async () => {
      const { body, statusCode } = await mock.inject({
        method: 'POST',
        url: `/project/${projectPrefixPath}/endpoint`,
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
        payload: invalidPayload,
      });

      expect(statusCode).to.equal(400);
      const json = JSON.parse(body);
      expect(json).to.have.property('statusCode');
      expect(json).to.have.property('message');
    });

    it('Should return 201 -> Success', async () => {
      const { body, statusCode } = await mock.inject({
        method: 'POST',
        url: `/project/${projectPrefixPath}/endpoint`,
        payload: validPayload,
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      });

      expect(statusCode).to.equal(201);
      const json = JSON.parse(body);
      expect(json).to.have.property('statusCode');
      expect(json).to.have.property('message');

      // set variable
      endpointPath = validPayload.path;
    });
  });

  describe('GET /project/:prefixPath/endpoint/:path', () => {
    it('Should return 401 -> Unauthorized', async () => {
      const { body, statusCode } = await mock.inject({
        method: 'GET',
        url: `/project/${projectPrefixPath}/endpoint/${endpointPath}`,
      });

      expect(statusCode).to.equal(401);
      const json = JSON.parse(body);
      expect(json).to.have.property('statusCode');
      expect(json).to.have.property('message');
    });

    it('Should return 404 -> Not found', async () => {
      const fakePath = 'iamfakepathdunw4nfnsdifsdfds';
      const { statusCode, json } = await mock.inject({
        method: 'GET',
        url: `/project/${projectPrefixPath}/endpoint/${fakePath}`,
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      });

      expect(statusCode).to.equal(404);
      expect(json()).to.be.an('object');
      expect(json()).to.have.property('statusCode');
      expect(json()).to.have.property('message');
    });

    it('Should return 200', async () => {
      const { statusCode, json } = await mock.inject({
        method: 'GET',
        url: `/project/${projectPrefixPath}/endpoint/${endpointPath}`,
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      });

      expect(statusCode).to.equal(200);
      expect(json()).to.be.an('object');
    });
  });

  describe('PUT /project/endpoint/:prefixPath', () => {
    it('Should return 401 -> Unauthorized', async () => {
      const { body, statusCode } = await mock.inject({
        method: 'PUT',
        url: `/project/${projectPrefixPath}/endpoint/${endpointPath}`,
        payload: {
          name: 'Unauthorized',
        },
      });

      expect(statusCode).to.equal(401);
      const json = JSON.parse(body);
      expect(json).to.have.property('statusCode');
      expect(json).to.have.property('message');
    });

    it('Should return 404 -> Notfound', async () => {
      const fakePath = 'iamfakepathdunw4nfnsdifsdfds';
      const { statusCode, json } = await mock.inject({
        method: 'PUT',
        url: `/project/${projectPrefixPath}/endpoint/${fakePath}`,
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
        payload: {
          name: 'Unauthorized',
        },
      });

      expect(statusCode).to.equal(404);
      expect(json()).to.be.an('object');
      expect(json()).to.have.property('statusCode');
      expect(json()).to.have.property('message');
    });

    it('Should return 400 -> Invalid body', async () => {
      const { body, statusCode } = await mock.inject({
        method: 'PUT',
        url: `/project/${projectPrefixPath}/endpoint/${endpointPath}`,
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
        payload: {
          schema: null,
          type: 'hora',
        },
      });

      expect(statusCode).to.equal(400);
      const json = JSON.parse(body);
      expect(json).to.have.property('statusCode');
      expect(json).to.have.property('message');
    });

    it('Should return 401 -> Unauthorized, not their own', async () => {
      // Coming soon
    });

    it('Should return 200', async () => {
      const { statusCode, json } = await mock.inject({
        method: 'PUT',
        url: `/project/${projectPrefixPath}/endpoint/${endpointPath}`,
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
        payload: {
          name: 'Updated',
        },
      });

      expect(statusCode).to.equal(200);
      expect(json()).to.be.an('object');
    });
  });

  describe('DELETE /project/endpoint/:prefixPath', () => {
    it('Should return 401 -> Unauthorized', async () => {
      const { body, statusCode } = await mock.inject({
        method: 'DELETE',
        url: `/project/${projectPrefixPath}/endpoint/${endpointPath}`,
      });

      expect(statusCode).to.equal(401);
      const json = JSON.parse(body);
      expect(json).to.have.property('statusCode');
      expect(json).to.have.property('message');
    });

    it('Should return 404 -> Notfound', async () => {
      const fakePath = 'iamfakepathdunw4nfnsdifsdfds';
      const { statusCode, json } = await mock.inject({
        method: 'DELETE',
        url: `/project/${projectPrefixPath}/endpoint/${fakePath}`,
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      });

      expect(statusCode).to.equal(404);
      expect(json()).to.be.an('object');
      expect(json()).to.have.property('statusCode');
      expect(json()).to.have.property('message');
    });

    it('Should return 401 -> Unauthorized, not their own', async () => {
      // Coming soon
    });

    it('Should return 200', async () => {
      const { statusCode, json } = await mock.inject({
        method: 'DELETE',
        url: `/project/${projectPrefixPath}/endpoint/${endpointPath}`,
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      });

      expect(statusCode).to.equal(200);
      expect(json()).to.be.an('object');
    });
  });

  describe('POST /project/generate_key', () => {
    it('Should return 401 -> Unauthorized', async () => {
      const { body, statusCode } = await mock.inject({
        method: 'POST',
        url: `/project/${projectPrefixPath}/generate_key`,
      });

      expect(statusCode).to.equal(401);
      const json = JSON.parse(body);
      expect(json).to.have.property('statusCode');
      expect(json).to.have.property('message');
    });

    it('Should return 401 -> Unauthorized, not their own', async () => {
      // Coming soon
    });

    it('Should return 200', async () => {
      const { statusCode, json } = await mock.inject({
        method: 'POST',
        url: `/project/${projectPrefixPath}/generate_key`,
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      });

      expect(statusCode).to.equal(200);
      expect(json()).to.be.an('object');
      expect(json()).to.be.have.property('statusCode');
      expect(json()).to.be.have.property('apiKey');
    });
  });

  describe('DELETE /project', () => {
    it('Should return 401 -> Unauthorized', async () => {
      const { body, statusCode } = await mock.inject({
        method: 'DELETE',
        url: `/project/${projectPrefixPath}`,
      });

      expect(statusCode).to.equal(401);
      const json = JSON.parse(body);
      expect(json).to.have.property('statusCode');
      expect(json).to.have.property('message');
    });

    it('Should return 401 -> Unauthorized, not their own', async () => {
      // Coming soon
    });

    it('Should return 404 -> Notfound', async () => {
      const fakePath = 'iamfakepathdunw4nfnsdifsdfds';
      const { statusCode, json } = await mock.inject({
        method: 'DELETE',
        url: `/project/${fakePath}`,
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      });

      expect(statusCode).to.equal(404);
      expect(json()).to.be.an('object');
      expect(json()).to.have.property('statusCode');
      expect(json()).to.have.property('message');
    });

    it('Should return 200', async () => {
      const { statusCode, json } = await mock.inject({
        method: 'DELETE',
        url: `/project/${projectPrefixPath}`,
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      });

      expect(statusCode).to.equal(200);
      expect(json()).to.be.an('object');
      expect(json()).to.have.property('statusCode');
    });
  });

  after(async () => {
    // Remove User
    await User.findOneAndRemove({ email });
    // Remove Project
    await Project.deleteMany({
      id: { $in: projectsId },
    });
  });
});
