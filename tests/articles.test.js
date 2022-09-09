const { expect } = require('chai');
const { describe, it } = require('mocha');
const request = require('supertest');
const app = require('../app');

describe('Fetch articles test', async () => {
  it('Checks the amount of public articles', async () => {
    const { body, status } = await request(app).get('/content');
    expect(status).to.equal(200);
    expect(body.length).to.equal(3);
  });
});

describe('Fetch private article test', async () => {
  it('Shows 403 error', async () => {
    const { status } = await request(app).get('/content/5');
    expect(status).to.equal(403);
  });
});

describe('Fetch non-existant article test', async () => {
  it('Shows 404 error', async () => {
    const { status } = await request(app).get('/content/6');
    expect(status).to.equal(404);
  });
});
