const config = require('config');
const mongoose = require('mongoose');

const uri = config.get('databaseUrl');
mongoose.connect(uri, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

module.exports = mongoose;
