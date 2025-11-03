const router = require('express').Router();
const auth = require('../middlewares/auth');

const { NOT_FOUND } = require('../utils/errors');

const userRouter = require('./users');
const authRouter = require('./auth');
const clothingItemRouter = require('./clothingItems');
const { getItems } = require('../controllers/clothingItems');

router.use('/', authRouter);

// Public route - GET /items
router.get('/items', getItems);

// Protected routes
router.use(auth);

router.use('/users', userRouter);
router.use('/items', clothingItemRouter);


router.use((req, res) => {
  res.status(NOT_FOUND).json({ message: 'Resource not found' });
});

module.exports = router;