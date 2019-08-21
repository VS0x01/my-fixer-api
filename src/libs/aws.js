const config = require('config');
const AWS = require('aws-sdk');

const options = {
  accessKeyId: config.get('aws').accessKeyID,
  secretAccessKey: config.get('aws').secretAccessKey,
};

AWS.config.update(options);

module.exports = AWS;
