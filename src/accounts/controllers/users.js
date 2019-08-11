const passport = require('koa-passport');
const jwt = require('../../utils/jwt');
const User = require('../models/user');
const Token = require('../models/token');

// POST /accounts/sign-in
exports.signIn = async (ctx, next) => {
  await passport.authenticate('local', async (err, user) => {
    if (user) {
      const { fullName, photo } = user;
      const payload = {
        id: user._id,
        role: user.role,
      };
      const tokens = await jwt.generateAndUpdateTokens(payload, user._id);
      const { accessToken, refreshToken } = tokens;
      ctx.body = {
        fullName,
        photo,
        accessToken,
        refreshToken: `JWT ${refreshToken.token}`,
      };
    } else {
      ctx.body = {
        error: err,
      };
    }
  })(ctx, next);
};

// GET /accounts/token
exports.token = async (ctx) => {
  const decoded = await jwt.verifyRefreshToken(ctx.header.authorization);
  const token = await Token.findOne({ tokenID: decoded.id });
  // TODO: Add conditions
  const payload = {
    id: 1,
  };
  const tokens = await jwt.generateAndUpdateTokens(payload, token.userID);
  ctx.body = {
    accessToken: tokens.accessToken,
    refreshToken: `JWT ${tokens.refreshToken.token}`,
  };
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
