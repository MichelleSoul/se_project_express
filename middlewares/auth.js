const jwt = require('jsonwebtoken');
const { AUTH_ERROR } = require('../utils/errors');

const { JWT_SECRET = 'some-secret-key' } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(AUTH_ERROR).send({ message: 'Authorization required' });
  }

  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(AUTH_ERROR).send({ message: 'Invalid or expired token' });
  }

  req.user = payload;
  return next();
};
