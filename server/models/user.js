const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: String,
  name: String,
  email: String,
  password: String // Optional for manual login
});

module.exports = mongoose.model('User', userSchema);
