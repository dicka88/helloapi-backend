import {
  before,
  describe, it,
} from 'mocha';
import faker from '@faker-js/faker';
import { expect } from 'chai';
import { ObjectId } from 'fastify-mongodb';
import app from '../app';

describe('Document testing', () => {
  let mock: any;

  before(async () => {
    mock = await app();
  });

  let id: string;

  describe('POST /documents/public', () => {
    it('Should return 400 -> Create public document with invalid body', async () => {
      const response = await mock.inject({
        method: 'POST',
        url: '/documents/public',
        payload: {
          title: 'Public document',
        },
      });

      expect(response.statusCode).to.equal(400);
      expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
      const json = JSON.parse(response.body);
      expect(json).to.have.property('statusCode');
      expect(json).to.have.property('message');
    });

    it('Should return 201 -> Create public document', async () => {
      const response = await mock.inject({
        method: 'POST',
        url: '/documents/public',
        payload: {
          title: 'Public document',
          content: JSON.stringify({
            statusCode: 200,
            message: 'Hello API',
          }),
        },
      });

      expect(response.statusCode).to.equal(201);
      expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
      const json = JSON.parse(response.body);
      expect(json).to.have.property('_id');
      expect(json).to.have.property('title');
      expect(json).to.have.property('content');
      expect(json).to.have.property('createdAt');

      // set state
      id = json._id;
    });
  });

  describe('GET /documents/public/:id', () => {
    it('Should return 200 -> Get public document', async () => {
      const response = await mock.inject({
        method: 'GET',
        url: `/documents/public/${id}`,
      });

      expect(response.statusCode).to.equal(200);
      expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
      const json = JSON.parse(response.body);
      expect(json).to.have.property('_id');
      expect(json).to.have.property('title');
      expect(json).to.have.property('content');
      expect(json).to.have.property('createdAt');
    });

    it('Should return 404 -> Get non exists document', async () => {
      const fakeId = new ObjectId(99999).toString();
      const response = await mock.inject({
        method: 'GET',
        url: `/documents/public/${fakeId}`,
      });

      expect(response.statusCode).to.equal(404);
      expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
      const json = JSON.parse(response.body);
      expect(json).to.have.property('statusCode');
      expect(json).to.have.property('message');
    });
  });

  describe('PUT /documents/public', () => {
    it('Should return 200 -> Update public document', async () => {
      const response = await mock.inject({
        method: 'PUT',
        url: `/documents/public/${id}`,
        payload: {
          title: 'Public document',
          content: JSON.stringify({
            statusCode: 200,
            message: 'Hello API - Updated',
          }),
        },
      });

      expect(response.statusCode).to.equal(200);
      expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
      const json = JSON.parse(response.body);
      expect(json).to.have.property('_id');
      expect(json).to.have.property('title');
      expect(json).to.have.property('content');
      expect(json).to.have.property('createdAt');
    });

    it('Should return 404 -> Update public non exists document', async () => {
      const fakeId = new ObjectId(99999).toString();

      const response = await mock.inject({
        method: 'PUT',
        url: `/documents/public/${fakeId}`,
        payload: {
          title: 'Public document',
          content: JSON.stringify({
            statusCode: 200,
            message: 'Hello API - Updated',
          }),
        },
      });

      expect(response.statusCode).to.equal(404);
      expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
      const json = JSON.parse(response.body);
      expect(json).to.have.property('statusCode');
      expect(json).to.have.property('message');
    });
  });

  let jwtToken: string;
  let documentId: string;

  it('POST /signup -> register new user', async () => {
    const response = await mock.inject({
      method: 'POST',
      url: '/auth/signup',
      payload: {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: 'randompassword',
        retypePassword: 'randompassword',
      },
    });

    const json = JSON.parse(response.body);

    jwtToken = json.token;
  });

  // Require auth
  describe('POST /documents', () => {
    it('Should return 400 -> Create document with invalid body', async () => {
      const response = await mock.inject({
        method: 'POST',
        url: '/documents',
        payload: {
          title: 'Document',
        },
      });

      expect(response.statusCode).to.equal(400);
      expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
      const json = JSON.parse(response.body);
      expect(json).to.have.property('statusCode');
      expect(json).to.have.property('message');
    });

    it('Should return 201 -> Create document', async () => {
      const response = await mock.inject({
        method: 'POST',
        url: '/documents',
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
        payload: {
          title: 'Private document',
          content: JSON.stringify({
            statusCode: 200,
            message: 'I am private document',
          }),
        },
      });

      expect(response.statusCode).to.equal(201);
      expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
      const json = JSON.parse(response.body);
      expect(json).to.have.property('_id');
      expect(json).to.have.property('title');
      expect(json).to.have.property('content');
      expect(json).to.have.property('createdAt');

      documentId = json._id;
    });
  });

  describe('GET /documents', () => {
    it('Should return 401 -> Get document with not authenticated', async () => {
      const response = await mock.inject({
        method: 'GET',
        url: '/documents',
      });

      expect(response.statusCode).to.equal(401);
      expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
      const json = JSON.parse(response.body);
      expect(json).to.have.property('statusCode');
      expect(json).to.have.property('message');
    });
  });

  describe('GET /documents/:id', () => {
    it('Should return 200 -> Get document with id', async () => {
      const response = await mock.inject({
        method: 'GET',
        url: `/documents/${documentId}`,
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      });

      expect(response.statusCode).to.equal(200);
      expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
      const json = JSON.parse(response.body);
      expect(json).to.have.property('_id');
      expect(json).to.have.property('title');
      expect(json).to.have.property('content');
      expect(json).to.have.property('createdAt');
    });

    it('Should return 404 -> Get non exists document', async () => {
      const fakeId = new ObjectId(98434989).toString();
      const response = await mock.inject({
        method: 'GET',
        url: `/documents/${fakeId}`,
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      });

      expect(response.statusCode).to.equal(404);
      expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
      const json = JSON.parse(response.body);
      expect(json).to.have.property('statusCode');
      expect(json).to.have.property('message');
    });
  });

  describe('PUT /documents/:id', () => {
    it('Should return 200 -> Update document', async () => {
      const response = await mock.inject({
        method: 'PUT',
        url: `/documents/${documentId}`,
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
        payload: {
          title: 'Private document updated',
          content: JSON.stringify({
            statusCode: 200,
            message: 'I am private document and updated',
          }),
        },
      });

      expect(response.statusCode).to.equal(200);
      expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
      const json = JSON.parse(response.body);
      expect(json).to.have.property('_id');
      expect(json).to.have.property('title');
      expect(json).to.have.property('content');
      expect(json).to.have.property('createdAt');
    });

    it('Should return 404 -> Update non exists document', async () => {
      const fakeId = new ObjectId(9812932).toString();

      const response = await mock.inject({
        method: 'PUT',
        url: `/documents/${fakeId}`,
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
        payload: {
          title: 'Private document updated',
          content: JSON.stringify({
            statusCode: 200,
            message: 'I am private document and updated',
          }),
        },
      });

      expect(response.statusCode).to.equal(404);
      expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
      const json = JSON.parse(response.body);
      expect(json).to.have.property('statusCode');
      expect(json).to.have.property('message');
    });
  });

  describe('DELETE /documents/:id ', () => {
    it('Should return 200 -> Delete document', async () => {
      const response = await mock.inject({
        method: 'DELETE',
        url: `/documents/${documentId}`,
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      });

      expect(response.statusCode).to.equal(200);
      expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
      const json = JSON.parse(response.body);
      expect(json).to.have.property('statusCode');
      expect(json).to.have.property('message');
    });

    it('Should return 404 -> Delete non exists document', async () => {
      const fakeId = new ObjectId(310004).toString();
      const response = await mock.inject({
        method: 'DELETE',
        url: `/documents/${fakeId}`,
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      });

      expect(response.statusCode).to.equal(404);
      expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
      const json = JSON.parse(response.body);
      expect(json).to.have.property('statusCode');
      expect(json).to.have.property('message');
    });
  });
});
