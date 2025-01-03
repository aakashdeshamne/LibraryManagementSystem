const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    bookid: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', unique: true, required: true },
    duedate: { 
      type: Date, 
      ref: 'Borrow', 
      required: true 
    },
    fine: { type: Number, required: true }
  },
  { timestamps: true }
);

const Return = mongoose.model('Return', returnSchema);
module.exports = Return;
