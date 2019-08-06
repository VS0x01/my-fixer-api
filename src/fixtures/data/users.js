const { ObjectId } = require('mongodb');

module.exports = [
  {
    _id: ObjectId(),
    name: 'Carmine',
    address: {
      city: 'Boston',
      state: 'MA',
    },
  },
  {
    _id: ObjectId(),
    name: 'Jimmy',
    address: {
      city: 'Denver',
      state: 'CO',
    },
  },
];
