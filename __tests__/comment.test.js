const { prepare, agent } = require('../lib/data-helpers/data-helpers');

// const Comment = require('../lib/models/Comment');
const Post = require('../lib/models/Post');
const User = require('../lib/models/User');

describe('Comment routes', () => {

  it('Posts a comment', async() => {
    const post = prepare(await Post.findOne());
    const user = prepare(await User.findOne());

    return agent
      .post('/api/v1/comments')
      .send({
        commentBy: user._id,
        post: post._id,
        comment: 'Here are some words'
      })
      .then(res => {
        expect(res.body).toEqual({
          commentBy: user._id.toString(),
          post: post._id.toString(),
          comment: 'Here are some words',
          __v: 0,
          _id: expect.anything()
        });
      });
  });
});
