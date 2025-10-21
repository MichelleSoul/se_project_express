const router = require('express').Router();
const { signIn, createUser } = require('../controllers/users');

router.post('/signin', signIn);
router.post('/signup', createUser);

module.exports = router;
