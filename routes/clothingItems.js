const router = require('express').Router();
const {
  createItem,
  deleteItem,
  likeItem,
  dislikeItem
} = require('../controllers/clothingItems');

const { validateCardBody, validateId } = require('../middlewares/validation');

// Create new item
router.post('/', validateCardBody, createItem);

// Delete item by id
router.delete('/:itemId', validateId, deleteItem);

// Like item
router.put('/:itemId/likes', validateId, likeItem);

// Unlike item
router.delete('/:itemId/likes', validateId, dislikeItem);

module.exports = router;