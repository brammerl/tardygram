const chance = require('chance').Chance();

const User = require('../lib/models/User');
const Comment = require('../lib/models/Comment');
const Post = require('../lib/models/Post');

module.exports = async({ users = 50, comments = 1000, posts = 5000 }) => {
  const userArray = await User.create([...Array(users)].map((_, i) => ({
    username: `test${i}@test.com`,
    password: 'password'
    // profileImage: chance.url()
  })));

  const postArray = await Promise.all([...Array(posts)].map(async() => {
    const numTags = Math.ceil(Math.random() * 6);
    const tagsArray = [...Array(numTags)];
    return Post.create({
      user: chance.pickone(userArray)._id,
      photoUrl: chance.url(),
      caption: chance.sentence({ words: 4 }),
      tags: tagsArray.map(() => {
        return chance.word();
      })
    });
  }));

  await Promise.all([...Array(comments)].map(async() => {
    return Comment.create({
      commentBy: chance.pickone(userArray)._id,
      post: chance.pickone(postArray)._id,
      comment: chance.sentence({ words: 3 })
    });
  }));
  
};
