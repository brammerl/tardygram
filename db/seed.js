const chance = require('chance').Chance();

const User = require('../lib/models/User');
const Comment = require('../lib/models/Comment');
const Post = require('../lib/models/Post');

module.exports = async({ users = 50, comments = 1000, posts = 5000 }) => {
  const userArray = await Promise.all([...Array(users)].map(async() => {
    return User.create({
      username: chance.name(),
      password: '123'  
    });
  }));

  const postArray = await Promise.all([...Array(posts)].map(async() => {
    const numTags = Math.floor(Math.ceil() * 6);
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
