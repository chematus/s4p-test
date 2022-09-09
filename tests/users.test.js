const { expect } = require('chai');
const { describe, it } = require('mocha');
const request = require('supertest');
const app = require('../app');

describe('Fetch user profile test', async () => {
  it('Shows public info about user', async () => {
    const { body, status } = await request(app).get('/user/1');
    const { user } = body;
    const { Articles } = user;
    expect(status).to.equal(200);
    expect(user.name).to.equal('John Doe');
    expect(user).to.not.have.key('password');
    expect(Articles.length).to.equal(1);
    expect(Articles[0].name).to.equal('Test title 1');
  });
});

describe('Fetch unauthorized profile test', async () => {
  it('Shows 403 error', async () => {
    const { status } = await request(app).get('/user');
    expect(status).to.equal(403);
  });
});

describe('Fetch non-existant user test', async () => {
  it('Shows 404 error', async () => {
    const { status } = await request(app).get('/user/3');
    expect(status).to.equal(404);
  });
});
