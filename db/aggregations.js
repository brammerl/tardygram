module.exports = {
  top10posts
};

const top10posts = [{
  '$group': {
    '_id': '$post', 
    'commentsOnPost': {
      '$sum': 1
    }
  }
}, {
  '$sort': {
    'commentsOnPost': -1
  }
}];
