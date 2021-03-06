const config = require('config');
const crypto = require('crypto');
const { ObjectId } = require('mongodb');

module.exports = [
  {
    firstName: 'Test',
    lastName: 'Admin',
    role: 'admin',
    country: 'Ukraine',
    email: 'test@example.com',
    confirmed: true,
    salt: 'test',
    encryptedPassword: crypto
      .pbkdf2Sync('qwerty', 'test', config.get('crypto').hash.iterations, config.get('crypto').hash.length, 'sha512')
      .toString('hex'),
  },
  {
    _id: ObjectId(),
    firstName: 'Carmine',
    lastName: 'Max',
    role: 'admin',
    country: 'Ukraine',
    email: 'admin.email@example.com',
    confirmed: true,
    salt: 'salt0',
    encryptedPassword: crypto
      .pbkdf2Sync('qwerty', 'salt0', config.get('crypto').hash.iterations, config.get('crypto').hash.length, 'sha512')
      .toString('hex'),
  },
  {
    _id: ObjectId(),
    firstName: 'Jimmy',
    lastName: 'Min',
    role: 'user',
    country: 'Canada',
    email: 'user.email@example.com',
    confirmed: true,
    salt: 'salt1',
    encryptedPassword: crypto
      .pbkdf2Sync('qwerty', 'salt1', config.get('crypto').hash.iterations, config.get('crypto').hash.length, 'sha512')
      .toString('hex'),
  },
];
