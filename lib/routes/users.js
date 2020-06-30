const { Router } = require('express');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { mostPopularUsers, mostProlificUsers, biggestLeaderUsers, averageCommentsPerPost } = require('../../db/aggregations');
const ensureAuth = require('../middleware/ensureAuth');


const setCookie = (user, res) => {
  res.cookie('session', user.authorizeToken(), {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true
  });
};

module.exports = Router()
  .post('/signup', (req, res, next) => {
    User
      .create(req.body)
      .then(user => {
        setCookie(user, res);
        res.send(user);
      })
      .catch(next);
  })

  .post('/login', (req, res, next) => {
    User
      .authorizeUser(req.body.username, req.body.password)
      .then(user => {
        setCookie(user, res);
        res.send(user);
      })
      .catch(next);
  })

  .get('/verify', ensureAuth, (req, res)  => {
    res.send(req.user);
  })
  
  .get('/popular', (req, res, next)  => {
    Comment
      .aggregate(mostPopularUsers)
      .then(topUsers => res.send(topUsers))
      .catch(next);
  })
  
  .get('/prolific', (req, res, next)  => {
    Post
      .aggregate(mostProlificUsers)
      .then(prolificUsers => res.send(prolificUsers))
      .catch(next);
  })
  
  .get('/leader', (req, res, next)  => {
    Comment
      .aggregate(biggestLeaderUsers)
      .then(biggestLeaders => res.send(biggestLeaders))
      .catch(next);
  })
  
  .get('/impact', (req, res, next)  => {
    Comment
      .aggregate(averageCommentsPerPost)
      .then(averageComments => res.send(averageComments))
      .catch(next);
  });
