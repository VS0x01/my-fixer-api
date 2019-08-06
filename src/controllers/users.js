const User = require('../models/user');

// GET /users
exports.index = async (ctx) => {
  const users = await User.find({});
  ctx.body = {
    success: true,
    users,
  };
};

// POST /users
exports.create = async (ctx) => {
  const user = new User(ctx.request.body);
  await user.save();
  ctx.body = {
    success: true,
  }
};

// GET /users/1
exports.read = async (ctx) => {
  const user = await User.findById(ctx.params.userID);
  ctx.body = {
    success: true,
    user,
  };
};

// PATCH/PUT /users/1
exports.update = async (ctx) => {
  const user = await User.findById(ctx.params.userID);
  user.updateOne(ctx.request.body);
  ctx.body = {
    success: true,
    user,
  };
};

// DELETE /users/1
exports.destroy = async (ctx) => {
  const user = await User.findById(ctx.params.userID);
  user.deleteOne();
  ctx.body = {
    success: true,
  };
};
