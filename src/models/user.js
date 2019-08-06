const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

module.exports = mongoose.model('User', userSchema);
