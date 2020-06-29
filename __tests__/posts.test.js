const chance = require('chance').Chance();
const { agent, prepare, getLoggedInUser } = require('../lib/data-helpers/data-helpers');
const Post = require('../lib/models/Post');

describe('posts routes', () => {
  // it('creates a post via POST', async() => {
  //   const loggedInUser = await getLoggedInUser();
  //   const newPost = {
  //     photoUrl: chance.url(),
  //     caption: chance.sentence(),
  //     tags: ['spring', 'skateboarding', 'gaming', 'art']
  //   };

  //   return agent
  //     .post('/api/v1/posts')
  //     .send(newPost)
  //     .then(res => {
  //       expect(res.body).toEqual({
  //         _id: expect.anything(),
  //         user: loggedInUser.id,
  //         photoUrl: newPost.photoUrl,
  //         caption: newPost.caption,
  //         tags: newPost.tags
  //       });
  //     });
  // });
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
});
