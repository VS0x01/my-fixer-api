const config = require('config');
const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

const uri = config.get('databaseUrl');
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
mongoose.plugin(beautifyUnique);

module.exports = mongoose;
