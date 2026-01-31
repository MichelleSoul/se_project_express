const router = require('express').Router();
const { signIn, createUser } = require('../controllers/users');
const { validateLogin, validateUserBody } = require('../middlewares/validation');

router.post('/signin', validateLogin, signIn);
router.post('/signup', validateUserBody, createUser);

module.exports = router;
