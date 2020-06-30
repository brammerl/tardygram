require('dotenv').config();

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');
require('../lib/data-helpers/data-helpers');

describe('user routes', () => {
  it('creates an user via POST', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({
        username: 'tester@gmail.com',
        password: 'testpw'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          username: 'tester@gmail.com'
        });
      });   
  });

  it('logs the user in via POST', async() => {
    const user = await User.create({
      username: 'tester@gmail.com',
      password: 'ugh'
    });

    return request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'tester@gmail.com',
        password: 'ugh'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: user.id,
          username: 'tester@gmail.com'
        });
      });
  });

  it('verifies user is logged in via GET', async() => {
    const user = await User.create({
      username: 'test@gmail.com',
      password: 'testpw'
    });

    const agent = request.agent(app);

    return agent
      .post('/api/v1/auth/login')
      .send({
        username: 'test@gmail.com',
        password: 'testpw'
      })
      .then(()  => {
        return agent
          .get('/api/v1/auth/verify');
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: user.id,
          username: user.username
        });
      });
  });

  it('GETs the top 10 users with the most comments on their posts', async() => {
    const agent = request.agent(app);

    return agent
      .get('/api/v1/auth/popular')
      .then(res => {
        expect(res.body).toContainEqual({
          _id: expect.anything(),
          username: expect.any(String),
          totalCommentsOnPosts: expect.any(Number)
        });
        expect(res.body).toHaveLength(10);
      });
  });

  it('GETs the top 10 users with the most posts', async() => {
    const agent = request.agent(app);

    return agent
      .get('/api/v1/auth/prolific')
      .then(res => {
        expect(res.body).toContainEqual({
          _id: expect.anything(),
          username: expect.any(String),
          totalPosts: expect.any(Number)
        });
        expect(res.body).toHaveLength(10);
      });
  });

  it('GETs the top 10 users who have commented the most', async() => {
    const agent = request.agent(app);

    return agent
      .get('/api/v1/auth/leader')
      .then(res => {
        expect(res.body).toContainEqual({
          _id: expect.anything(),
          username: expect.any(String),
          numberOfComments: expect.any(Number)
        });
        expect(res.body).toHaveLength(10);
      });
  });

  it('GETs the top 10 users with the highest average comments per post', async() => {
    const agent = request.agent(app);

    return agent
      .get('/users/impact')
      .then(res => {
        expect(res.body).toContainEqual({
          _id: expect.anything(),
          username: expect.any(String),
          averageCommentsPerPost: expect.any(Number)
        });
        expect(res.body).toHaveLength(10);
      });
  });
});
