const mongoose = require('mongoose');

const comment = new mongoose.Schema({
  
  commentBy: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Post',
    required: true
  },
  comment: {
    type: String,
    required: true
  }
});



module.exports = mongoose.model('Comment', comment);
