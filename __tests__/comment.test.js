const { prepare } = require('../lib/data-helpers/data-helpers');

const request = require('supertest');
const app = require('../lib/app');
const agent = request.agent(app);

// const Comment = require('../lib/models/Comment');
const Post = require('../lib/models/Post');
const User = require('../lib/models/User');

describe('Comment routes', async() => {

  it('Posts a comment', async() => {
    const post = prepare(await Post.findOne());
    const user = prepare(await User.findOne());

    return agent
      .post('/api/v1/comments')
      .send({
        commentBy: user.id,
        post: post.id,
        comment: 'Here are some words'
      })
      .then(res => {
        expect(res.body).toEqual({
          commentBy: user.id,
          post: post.id,
          comment: 'Here are some words',
          __v: 0,
          id: expect.anything()
        });
      });
  });
});
