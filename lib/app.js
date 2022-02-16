const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// Built in middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:7891',
    exposedHeaders: ['set-cookie'],
  })
);

// App routes
app.use('/api/v1/github', require('./controllers/github'));
app.use('/api/v1/sparkles', require('./controllers/sparkles'));

// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
