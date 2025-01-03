const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    type: { type: String, required: true },
    available: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
