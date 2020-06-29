require('../lib/data-helpers/data-helpers');

const request = require('supertest');
const app = require('../lib/app');
const Comment = require('../lib/models/Comment');
const Post = require('../lib/models/Post');

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
});
