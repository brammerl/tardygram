require('dotenv').config();

const chance = require('chance').Chance();
const { agent, prepare, getLoggedInUser } = require('../lib/data-helpers/data-helpers');
const Post = require('../lib/models/Post');

describe('posts routes', () => {
  it('creates a post via POST', async() => {
    const user = prepare(await getLoggedInUser());

    const newPost = {
      photoUrl: chance.url(),
      caption: chance.sentence(),
      tags: ['spring', 'skateboarding', 'gaming', 'art']
    };

    return agent
      .post('/api/v1/posts')
      .send(newPost)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          user: user._id,
          photoUrl: newPost.photoUrl,
          caption: newPost.caption,
          tags: newPost.tags
        });
      });
  });

  it('gets all posts', async() => {
    const posts = prepare(await Post.find());

    return agent
      .get('/api/v1/posts')
      .then(res => {
        expect(res.body).toEqual(posts);
      });
  });

  it('gets a post by ID', async() => {
    const post = prepare(await Post.findOne());

    return agent
      .get(`/api/v1/posts/${post._id}`)
      .then(res => {
        expect(res.body).toEqual(post);
      });
  });

  it('updates a post via PATCH', async() => {
    const user = await getLoggedInUser();
    const oldPost = prepare(await Post.findOne({ user: user._id }));

    return agent
      .patch(`/api/v1/posts/${oldPost._id}`)
      .send({ caption: 'new caption' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          user: user.id,
          photoUrl: oldPost.photoUrl,
          caption: 'new caption',
          tags: oldPost.tags
        });
      });
  });

  it('gets the top 10 posts with the most comments', async() => {
    return agent
      .get('/api/v1/posts/popular')
      .then(res => {
        expect(res.body).toContainEqual({
          _id: expect.anything(),
          commentsOnPost: expect.any(Number)
        });
        expect(res.body).toHaveLength(10);
      });
  });
});
