const { Router } = require('express');
const ensureAuth = require('../middleware/ensureAuth');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { top10posts } = require('../../db/aggregations'); 

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    Post
      .create({
        user: req.user,
        photoUrl: req.body.photoUrl,
        caption: req.body.caption,
        tags: req.body.tags
      })
      .then(post => res.send(post))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Post
      .find()
      .then(posts => res.send(posts))
      .catch(next);
  })
  .get('/popular', (req, res, next) => {
    Comment
      .aggregate(top10posts)
      .then(topPosts => res.send(topPosts))
      .catch(next);
  })
  .get('/:_id', (req, res, next) => {
    Post
      .findById(req.params._id)
      .then(posts => res.send(posts))
      .catch(next);
  })
  .patch('/:id', ensureAuth, (req, res, next) => {
    Post
      .isOwnerAndUpdate(req.user.id, req.params.id, req.body.caption)
      .then(update => res.send(update))
      .catch(next);
  })
  .delete('/:id', ensureAuth, (req, res, next) => {
    Post
      .isOwnerAndDelete(req.user.id, req.params.id)
      .then(update => res.send(update))
      .catch(next);
  });
