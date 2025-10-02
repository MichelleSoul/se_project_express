const ClothingItem = require('../models/clothingItem');
const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../utils/errors');
const { CREATED } = require('../utils/success');

// GET /items - Get all items
const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'An error has occurred on the server.' });
    });
};

// GET /items/:itemId - Get item by id
const getItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: err.message });
      } if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'An error has occurred on the server.' });
    });
};

// POST /items - Create new item
const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  console.log(req.user._id); // logging the user ID as requested
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(CREATED).send(item))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Invalid data passed to create item' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'An error has occurred on the server.' });
    });
};

// DELETE /items/:itemId - Delete item by id
const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: 'Item not found' });
      }
      return res.send(item);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Invalid item ID' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'An error has occurred on the server.' });
    });
};

// PUT /items/:itemId/likes - Like an item
const likeItem = (req, res) => {
  const userId = req.user._id;

  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: userId } }, // Add userId to likes array if not already there
    { new: true } // Return updated document
  )
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: 'Item not found' });
      }
      return res.send(item);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Invalid item ID' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'An error has occurred on the server.' });
    });
};

// DELETE /items/:itemId/likes - Unlike an item
const dislikeItem = (req, res) => {
  const userId = req.user._id;

  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: userId } }, // Remove userId from likes array
    { new: true } // Return updated document
  )
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: 'Item not found' });
      }
      return res.send(item);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Invalid item ID' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'An error has occurred on the server.' });
    });
};

module.exports = {
  getItems,
  getItem,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem
};
