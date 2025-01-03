const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    mobile: { type: Number, unique: true, required: true },
    admin: { type: Boolean, default: false }
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
