const express = require('express');
const mongoose = require('mongoose');
const mainRouter = require('./routes/index');

const app = express();

const { PORT = 3001 } = process.env;

app.use(express.json());

// Temporary authorization middleware
app.use((req, res, next) => {
  req.user = {
    _id: '68d42f0460c38ca88a875f94' // test user id
  };
  next();
});

app.use('/', mainRouter);

mongoose
  .connect('mongodb://127.0.0.1:27017/wtwr_db')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
