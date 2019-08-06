const User = require('../models/user');

exports.all = async (ctx) => {
  const users = await User.find({});
  ctx.body = {
    success: true,
    users,
  };
};
