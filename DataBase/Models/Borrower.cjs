const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    bookid: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', unique: true, required: true },
    duedate: { 
      type: Date, 
      default: () => new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), 
      required: true 
    }
  },
  { timestamps: true }
);

const Borrow = mongoose.model('Borrow', borrowSchema);
module.exports = Borrow;
