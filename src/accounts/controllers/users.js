const config = require('config');
const passport = require('koa-passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// POST /accounts/sign-in
exports.signIn = async (ctx, next) => {
  await passport.authenticate('local', (err, user) => {
    if (user) {
      const { fullName, photo } = user;
      const payload = {
        id: user._id,
        role: user.role,
      };
      const token = jwt.sign(payload, config.get('jwtSecret'));
      ctx.body = {
        fullName,
        photo,
        token: `JWT ${token}`,
      };
    } else {
      ctx.body = {
        error: err,
      };
    }
  })(ctx, next);
};

// GET /accounts
exports.index = async (ctx) => {
  const users = await User.find({});
  ctx.body = {
    users,
  };
};

// POST /accounts
exports.create = async (ctx) => {
  const {
    name: { first, last }, email, password, role,
  } = ctx.request.body;
  const user = new User({
    name: {
      first,
      last,
    },
    email,
    password,
    role,
  });
  await user.save();
  ctx.body = {
    success: true,
  };
};

// GET /accounts/1
exports.read = async (ctx) => {
  const user = await User.findById(ctx.params.userID);
  ctx.body = {
    user,
  };
};

// PATCH/PUT /accounts/1
exports.update = async (ctx) => {
  const user = await User.findById(ctx.params.userID);
  Object.assign(user, ctx.request.body);
  user.save();
  ctx.body = {
    user,
  };
};

// DELETE /accounts/1
exports.destroy = async (ctx) => {
  const user = await User.findByIdAndDelete(ctx.params.userID);
  ctx.body = {
    user,
  };
};
