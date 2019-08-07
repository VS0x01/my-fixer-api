const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  address: {
    type: Object,
  },
});

module.exports = mongoose.model('User', userSchema);
