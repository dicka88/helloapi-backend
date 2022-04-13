import { expect } from 'chai';
import { ObjectId } from 'fastify-mongodb';
import {
  it, before, describe, after,
} from 'mocha';
import Project, { ProjectInterface } from '../app/models/Project';
import Document from '../app/models/Document';
import app from '../app';

describe('API Testing', () => {
  let mock: any;
  let documentId: string;
  let project: ProjectInterface;

  before(async () => {
    mock = await app();

    // add fake api
    const fakeApi = await mock.inject({
      method: 'POST',
      url: '/documents/public',
      payload: {
        title: 'Hello world',
        content: JSON.stringify({
          statusCode: 200,
          message: 'hello world',
        }),
      },
    });

    const json = JSON.parse(fakeApi.body);
    documentId = json._id;

    // add fake project api
    project = await Project.create({
      userId: new ObjectId(99).toString(),
      collaborators: [],
      projectName: 'Books',
      projectAvatarUrl: null,
      projectDescription: 'Books API',
      prefixPath: 'books',
      apiKey: '2332123',
      hitTotal: 0,
      endpoints: [{
        name: 'Get Books',
        path: 'books',
        type: 'json',
        schema: null,
        data: {
          statusCode: 200,
          message: 'Books has been fetched',
        },
      }],
    });
  });

  describe('GET /api/:id', () => {
    it('should return 404 -> API not found', async () => {
      const fakeId = new ObjectId(11313).toString();
      const response = await mock.inject({
        method: 'GET',
        url: `/api/${fakeId}`,
      });

      expect(response.statusCode).to.equal(404);
    });

    it('should return 200', async () => {
      const response = await mock.inject({
        method: 'GET',
        url: `/api/${documentId}`,
      });

      expect(response.statusCode).to.equal(200);
    });
  });

  describe('GET /api/:prefix_path/:path', () => {
    it('Should return 404 -> API project not found', async () => {
      const response = await mock.inject({
        methd: 'GET',
        url: '/api/9349j9j430fj4jf/randompath',
      });

      expect(response.statusCode).to.equal(404);
    });

    it('Should return 200', async () => {
      const response = await mock.inject({
        methd: 'GET',
        url: `/api/${project.prefixPath}/${project.endpoints[0].path}`,
      });

      expect(response.statusCode).to.equal(200);
    });
  });

  after(async () => {
    // Remove document
    await Document.findByIdAndRemove(documentId);
    // Remove project path
    await Project.findByIdAndRemove(project._id);
  });
});
