const router = require('express').Router();
const auth = require('../middlewares/auth');

const { BAD_REQUEST } = require('../utils/errors');

const userRouter = require('./users');
const authRouter = require('./auth');
const clothingItemRouter = require('./clothingItems');

router.use('/', authRouter)

router.use(auth);

router.use('/users', userRouter);
router.use('/items', clothingItemRouter);


router.use((req, res) => {
  res.status(BAD_REQUEST).json({ message: 'Resource not found' });
});

module.exports = router;