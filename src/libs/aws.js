const config = require('config');
const AWS = require('aws-sdk');

const options = {
  accessKeyId: config.get('storage.aws').accessKeyID,
  secretAccessKey: config.get('storage.aws').secretAccessKey,
};

AWS.config.update(options);

module.exports = AWS;
