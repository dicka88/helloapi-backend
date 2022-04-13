import { before, describe, it } from 'mocha';
import { expect } from 'chai';
import app from '../app';

describe('Index Test', () => {
  let mock: any = null;

  before(async () => {
    mock = await app();
  });

  it('GET / -> should return json', async () => {
    const response = await mock.inject({
      method: 'GET',
      url: '/',
    });

    expect(response.statusCode).to.equal(200);
    expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
    expect(JSON.parse(response.body)).to.have.property('message');
  });
});
