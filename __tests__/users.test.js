require('dotenv').config();

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const Comment = require('../lib/models/Comment');
const Post = require('../lib/models/Post');
const User = require('../lib/models/User');

describe('user routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

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
});
