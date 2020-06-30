const postsWithMostComments = [{
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
},
{
  '$limit': 10
}];

const mostPopularUsers = [{
  '$group': {
    '_id': '$post', 
    'commentsOnPost': {
      '$sum': 1
    }
  }
}, {
  '$lookup': {
    'from': 'posts', 
    'localField': '_id', 
    'foreignField': '_id', 
    'as': 'postData'
  }
}, {
  '$group': {
    '_id': '$postData.user', 
    'totalCommentsOnPosts': {
      '$sum': '$commentsOnPost'
    }
  }
}, {
  '$sort': {
    'totalCommentsOnPosts': -1
  }
}, {
  '$limit': 10
}, {
  '$unwind': {
    'path': '$_id'
  }
}, {
  '$lookup': {
    'from': 'users', 
    'localField': '_id', 
    'foreignField': '_id', 
    'as': 'userData'
  }
}, {
  '$unwind': {
    'path': '$userData'
  }
}, {
  '$project': {
    'username': '$userData.username', 
    'totalCommentsOnPosts': '$totalCommentsOnPosts'
  }
}];

module.exports = {
  postsWithMostComments,
  mostPopularUsers
};
