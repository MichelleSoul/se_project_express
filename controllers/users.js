const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { CREATED } = require('../utils/success');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');
const NotFoundError = require('../errors/not-found-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const InternalServerError = require('../errors/internal-server-error');

const User = require('../models/user');

const { JWT_SECRET = 'some-secret-key' } = process.env;

// POST /signup
const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  // First check if user with this email already exists
  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return next(new ConflictError('User with this email already exists'));
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
        return next(new ConflictError('User with this email already exists'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Invalid user data provided'));
      }
      return next(new InternalServerError('An error has occurred on the server'));
    });
}

// GET /users/me
const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('User not found'));
      } if (err.name === 'CastError') {
        return next(new BadRequestError('Invalid user ID format'));
      }
      return next(new InternalServerError('An error has occurred on the server'));
    })
}

// PATCH /users/me
const updateCurrentUser = (req, res, next) => {
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
        return next(new BadRequestError('Invalid data provided for user update'));
      }
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('User not found'));
      }
      return next(new InternalServerError('An error has occurred on the server'));
    });
};


// POST /signin
const signIn = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError('Email and password are required'));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      return res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === 'Incorrect email or password') {
        return next(new UnauthorizedError('Incorrect email or password'));
      }
      return next(new InternalServerError('An error has occurred on the server'));
    });
};


module.exports = { createUser, getCurrentUser, updateCurrentUser, signIn };