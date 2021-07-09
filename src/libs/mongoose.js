const config = require('config');
const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const gridfsMongoInit = require('../utils/gridfsMongo').init;

const uri = config.get('databaseUrl');
(async function connect() {
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  await gridfsMongoInit();
}());

mongoose.plugin(beautifyUnique);

module.exports = mongoose;
