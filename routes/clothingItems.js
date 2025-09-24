const router = require('express').Router();
const {
  getItems,
  getItem,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem
} = require('../controllers/clothingItems');

// Get all items
router.get('/', getItems);

// Get item by ID
router.get('/:itemId', getItem);

// Create new item
router.post('/', createItem);

// Delete item by id
router.delete('/:itemId', deleteItem);

// Like item
router.put('/:itemId/likes', likeItem);

// Unlike item
router.delete('/:itemId/likes', dislikeItem);

module.exports = router;