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

const mostProlificUsers = [{
  '$group': {
    '_id': '$user', 
    'totalPosts': {
      '$sum': 1
    }
  }
}, {
  '$sort': {
    'totalPosts': -1
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
    '_id': '$_id', 
    'username': '$userData.username', 
    'totalPosts': '$totalPosts'
  }
}, {
  '$limit': 10
}];

const biggestLeaderUsers = [{
  '$group': {
    '_id': '$commentBy', 
    'numberOfComments': {
      '$sum': 1
    }
  }
}, {
  '$sort': {
    'numberOfComments': -1
  }
}, {
  '$limit': 10
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
    '_id': '$_id', 
    'username': '$userData.username', 
    'numberOfComments': '$numberOfComments'
  }
}];

const averageCommentsPerPost = [{
  '$lookup': {
    'from': 'posts', 
    'localField': 'post', 
    'foreignField': '_id', 
    'as': 'postData'
  }
}, {
  '$unwind': {
    'path': '$postData'
  }
}, {
  '$group': {
    '_id': '$post', 
    'totalCommentsOnPost': {
      '$sum': 1
    }, 
    'postData': {
      '$first': '$postData'
    }
  }
}, {
  '$group': {
    '_id': '$postData.user', 
    'averageCommentsPerPost': {
      '$avg': '$totalCommentsOnPost'
    }, 
    'user': {
      '$first': '$postData.user'
    }
  }
}, {
  '$sort': {
    'averageCommentsPerPost': -1
  }
}, {
  '$lookup': {
    'from': 'users', 
    'localField': 'user', 
    'foreignField': '_id', 
    'as': 'userData'
  }
}, {
  '$unwind': {
    'path': '$userData'
  }
}, {
  '$project': {
    '_id': '$_id', 
    'averageCommentsPerPost': '$averageCommentsPerPost', 
    'username': '$userData.username'
  }
}, {
  '$limit': 10
}];

module.exports = {
  postsWithMostComments,
  mostPopularUsers,
  mostProlificUsers,
  biggestLeaderUsers,
  averageCommentsPerPost
};
