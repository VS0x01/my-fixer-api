const User = require('../models/user');

// POST /accounts/sign-in
exports.signIn = async (ctx, next) => {
  ctx.body = {
    success: true,
  };
};

// POST /accounts/sign-up
exports.signUp = async (ctx) => {
  ctx.body = {
    success: true,
  };
};

// GET /accounts/users
exports.index = async (ctx) => {
  const users = await User.find({});
  ctx.body = {
    success: true,
    users,
  };
};

// POST /accounts/users
exports.create = async (ctx) => {
  const user = new User(ctx.request.body);
  await user.save();
  ctx.body = {
    success: true,
  };
};

// GET /accounts/users/1
exports.read = async (ctx) => {
  const user = await User.findById(ctx.params.userID);
  ctx.body = {
    success: true,
    user,
  };
};

// PATCH/PUT /accounts/users/1
exports.update = async (ctx) => {
  const user = await User.findById(ctx.params.userID);
  user.updateOne(ctx.request.body);
  ctx.body = {
    success: true,
    user,
  };
};

// DELETE /accounts/users/1
exports.destroy = async (ctx) => {
  const user = await User.findById(ctx.params.userID);
  user.deleteOne();
  ctx.body = {
    success: true,
  };
};
