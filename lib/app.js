const express = require('express');
const app = express();

app.use(require('cookie-parser')());
app.use(require('cors')({
  origin: true,
  credentials: true
}));
app.use(express.json());

app.use('/api/v1/posts', require('./routes/posts'));
app.use('/api/v1/auth', require('./routes/users'));
app.use('/api/v1/comments', require('./routes/comments'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
