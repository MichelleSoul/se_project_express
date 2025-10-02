const router = require('express').Router();
const { BAD_REQUEST } = require('../utils/errors');

const userRouter = require('./users');
const clothingItemRouter = require('./clothingItems');

router.use('/users', userRouter);
router.use('/items', clothingItemRouter);

router.use((req, res) => {
  res.status(BAD_REQUEST).json({ message: 'Resource not found' });
});

module.exports = router;