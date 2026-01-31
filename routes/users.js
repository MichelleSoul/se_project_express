const router = require('express').Router();
const { getCurrentUser, updateCurrentUser } = require('../controllers/users');
const { validateUpdateUserProfile } = require('../middlewares/validation');

router.get('/me', getCurrentUser);
router.patch('/me', validateUpdateUserProfile, updateCurrentUser);

module.exports = router;