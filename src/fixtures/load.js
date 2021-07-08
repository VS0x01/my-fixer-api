const path = require('path');
const config = require('config');
const Fixtures = require('node-mongodb-fixtures');

const uri = config.get('databaseUrl');
const fixtures = new Fixtures({
  dir: path.join(__dirname, '/data'),
  filter: '.*',
});

fixtures
  .connect(uri)
  .then(() => fixtures.unload())
  .then(() => fixtures.load())
  // eslint-disable-next-line no-console
  .catch((e) => console.error(e))
  .finally(() => fixtures.disconnect());
