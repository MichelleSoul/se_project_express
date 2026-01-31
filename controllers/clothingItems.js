const ClothingItem = require('../models/clothingItem');
const { CREATED } = require('../utils/success');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');
const NotFoundError = require('../errors/not-found-error');
const InternalServerError = require('../errors/internal-server-error');

// GET /items - Get all items
const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      return next(new InternalServerError('Clothing item not found'));
    });
};

// POST /items - Create new item
const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  console.log(req.user._id); // logging the user ID as requested
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(CREATED).send(item))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Invalid data passed to create item'));
      }
      return next(new InternalServerError('An error has occurred on the server'));
    });
};

// DELETE /items/:itemId - Delete item by id
const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const currentUserId = req.user._id; // from auth middleware

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      // Check ownership
      if (item.owner.toString() !== currentUserId) {
        return next(new ForbiddenError('You can only delete your own items'));
      }

      // Delete the item
      return item.deleteOne()
        .then(() => res.send({ message: 'Item deleted successfully', item }));
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Item not found'));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError('Invalid item ID'));
      }
      return next(new InternalServerError('An error has occurred on the server'));
    });
};

// PUT /items/:itemId/likes - Like an item
const likeItem = (req, res, next) => {
  const userId = req.user._id;

  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: userId } }, // Add userId to likes array if not already there
    { new: true } // Return updated document
  )
    .then((item) => {
      if (!item) {
        return next(new NotFoundError('Item not found'));
      }
      return res.send(item);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Invalid item ID'));
      }
      return next(new InternalServerError('An error has occurred on the server'));
    });
};

// DELETE /items/:itemId/likes - Unlike an item
const dislikeItem = (req, res, next) => {
  const userId = req.user._id;

  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: userId } }, // Remove userId from likes array
    { new: true } // Return updated document
  )
    .then((item) => {
      if (!item) {
        return next(new NotFoundError('Item not found'));
      }
      return res.send(item);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Invalid item ID'));
      }
      return next(new InternalServerError('An error has occurred on the server'));
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem
};
