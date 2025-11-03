const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { BAD_REQUEST, AUTH_ERROR, NOT_FOUND, CONFLICT, INTERNAL_SERVER_ERROR } = require('../utils/errors');
const { CREATED } = require('../utils/success');

const User = require('../models/user');

const { JWT_SECRET = 'some-secret-key' } = process.env;

// POST /signup
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  // First check if user with this email already exists
  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(CONFLICT).send({ message: 'User with this email already exists' });
      }

      // If no existing user, proceed with creation
      return bcrypt.hash(password, 10)
        .then((hash) => User.create({
          name,
          avatar,
          email,
          password: hash,
        }))
        .then((user) => {
          const userObject = user.toObject();
          delete userObject.password;
          res.status(CREATED).send(userObject);
        });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === 11000) {
        return res.status(CONFLICT).send({ message: 'User with this email already exists' });
      }
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
}

// GET /users/me
const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: err.message });
      } if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'An error has occurred on the server.' });
    })
}

// PATCH /users/me
const updateCurrentUser = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'User not found' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'An error has occurred on the server.' });
    });
};


// POST /signin
const signIn = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(BAD_REQUEST).send({ message: 'Email and password are required' });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id }, JWT_SECRET, { expiresIn: '7d' }
      );
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      res.status(AUTH_ERROR).send({ message: 'Incorrect email or password' });
    });
};


module.exports = { createUser, getCurrentUser, updateCurrentUser, signIn };