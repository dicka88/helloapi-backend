import app from '../app.js';
import {it} from 'mocha';
import { expect } from 'chai';

it("Does return json", async () => {
  const mock = await app()

  const response = await mock.inject({
    method: 'GET',
    url: "/"
  })

  console.log(response.headers['content-type']);

  expect(response.statusCode).to.equal(200)
  expect(response.headers['content-type']).to.equal('application/json; charset=utf-8')
  expect(JSON.parse(response.body)).to.have.property('message')
})