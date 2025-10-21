const router = require('express').Router();
const { getUsers, getCurrentUser, updateCurrentUser } = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.patch('/me', updateCurrentUser);

module.exports = router;