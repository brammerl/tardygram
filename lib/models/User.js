require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true 
  },
  passwordHash: {
    type: String,
    required: true
  },
  profileUrl: {
    type: String
  }
}, {
  toJSON: {
    vituals: true,
    transform: (doc, ret) => {
      delete ret.__v;
      delete ret.passwordHash;
    }
  },
  toObject: {
    virtuals: true 
  }
});

schema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'user',
});

schema.virtual('posts', {
  ref: 'POST',
  localField: '_id',
  foreignField: 'post',
});


schema.virtual('password').set(function(password) {
  this.passwordHash = bcrypt.hashSync(password, + process.env.SALT_ROUNDS || 8);
});

schema.statics.authorizeUser = function(username, password) {
  return this.findOne({ username })
    .then(user => {
      if(!user) {
        throw new Error('Invalid email');
      }

      if(!bcrypt.compareSync(password, user.passwordHash)) {
        throw new Error('Invalid Password');
      }

      return user;
    });
};

schema.statics.verifyToken = function(token) {
  const { sub } = jwt.verify(token, process.env.APP_SECRET);

  return this.hydrate(sub);
};

schema.methods.authorizeToken = function() {
  return jwt.sign({ sub: this.toJSON() },
    process.env.APP_SECRET, { expiresIn: '24h' });
};

module.exports = mongoose.model('User', schema);


