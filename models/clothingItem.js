const mongoose = require('mongoose');
const validator = require('validator');

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30
  },
  avatar: {
    type: String,
    required: [true, 'Avatar URL is required'],
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Invalid URL format'
    }
  }
});

module.exports = mongoose.model('item', clothingItemSchema);