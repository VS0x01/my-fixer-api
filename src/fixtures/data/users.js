const { ObjectId } = require('mongodb');

module.exports = [
  {
    _id: ObjectId(),
    name: {
      first: 'Carmine',
      last: 'Max',
    },
    role: 'admin',
    country: 'Ukraine',
    email: 'admin.email@example.com',
  },
  {
    _id: ObjectId(),
    name: {
      first: 'Jimmy',
      last: 'Min',
    },
    role: 'user',
    country: 'Canada',
    email: 'user.email@example.com',
  },
];
