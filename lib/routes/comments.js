const { Router } = require('express');
const Comment = require('../models/Comment');
// const ensureAuth = require('../middleware/ensureAuth');

module.exports = Router()
  .post('/', (req, res, next) => {
    Comment
      .create(req.body)
      .then(comment => res.send(comment))
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    Comment
      .findByIdAndDelete(req.params.id)
      .then(comment => res.send(comment))
      .catch(next);
  });
