/* eslint-disable no-underscore-dangle */
const config = require('config');
const path = require('path');
const fs = require('fs');
const passport = require('koa-passport');
const nunjucks = require('nunjucks');
const uploadS3 = require('../../utils/uploadS3');
const sendEmail = require('../../utils/mailing');
const jwt = require('../../utils/jwt');
const User = require('../models/user');
const Token = require('../models/token');

nunjucks.configure(path.join(__dirname, '../templates'), { autoescape: true });

exports.jwtAuth = async (ctx, next) => {
  await passport.authenticate('jwt', { session: false },
    (err, user, info) => {
      if (err) throw err;
      else if (!user) throw info;
      else ctx.state.user = user;
      return next();
    })(ctx, next);
};

// POST /accounts/sign-in
exports.signIn = async (ctx, next) => {
  await passport.authenticate('local', async (err, user) => {
    if (user) {
      const payload = {
        id: user._id,
        role: user.role,
        confirmed: user.confirmed,
      };
      const tokens = await jwt.generateAuthTokens(payload, user);
      const { accessToken, refreshToken } = tokens;
      ctx.body = {
        user: user.toJSON(),
        accessToken: `JWT ${accessToken}`,
        refreshToken: `JWT ${refreshToken}`,
      };
    } else {
      throw err;
    }
  })(ctx, next);
};

// GET /accounts/token
exports.token = async (ctx) => {
  const decodedRefreshToken = jwt.verifyToken(ctx.header.authorization, config.get('jwtSecret').refreshToken.secret);
  const refreshToken = await Token.findById(decodedRefreshToken._id).populate('user');
  if (!refreshToken) {
    throw new Error('RefreshTokenError: token not found');
  } else if (decodedRefreshToken.type !== 'refresh') throw new Error('RefreshTokenError: invalid token');

  const payload = {
    id: refreshToken.user._id,
    role: refreshToken.user.role,
    confirmed: refreshToken.user.confirmed,
  };
  const tokens = await jwt.generateAuthTokens(payload, refreshToken.user);

  refreshToken.remove();

  ctx.body = {
    accessToken: `JWT ${tokens.accessToken}`,
    refreshToken: `JWT ${tokens.refreshToken}`,
  };
};

// DELETE /accounts/token
exports.logout = async (ctx) => {
  const { all, refreshToken } = ctx.parameters.permit('all', 'refreshToken').value();
  const decodedRefreshToken = jwt.verifyToken(refreshToken, config.get('jwtSecret').refreshToken.secret);

  if (all) {
    await Token.deleteMany({ user: decodedRefreshToken.userID });
  } else if (refreshToken) {
    await Token.findByIdAndDelete(decodedRefreshToken._id);
  }
  ctx.body = {
    success: true,
  };
};

// POST /accounts/confirm
exports.sendEmailConfirmation = async (ctx) => {
  const { confirmToken } = ctx.parameters.permit('token').value();

  if (confirmToken) {
    const verifiedConfirmToken = jwt.verifyToken(confirmToken, config.get('jwtSecret').accessToken.secret);
    if (verifiedConfirmToken.type === 'confirm') {
      await User.findByIdAndUpdate(verifiedConfirmToken._id, { confirmed: true });
      ctx.body = {
        status: 'Account confirmed',
      };
    }
  } else {
    const { _id, firstName, lastName } = ctx.request.body;
    if (!_id) {
      throw new Error('account required');
    }
    const attachments = [
      {
        content: Buffer.from(fs.readFileSync('./src/assets/logo.png')).toString('base64'),
        filename: 'logo.png',
      },
    ];
    const origin = ctx.request.headers.referer;
    const token = jwt.generateToken({
      _id,
      type: 'confirm',
    }, config.get('jwtSecret').accessToken);

    await sendEmail(
      'vadim.a.shesterikov@gmail.com',
      'service@myfixer.com',
      'Account confirmation',
      nunjucks.render('confirm_account.njk', {
        user: `${firstName} ${lastName}`,
        origin,
        token,
      }),
      attachments,
    );
    ctx.body = {
      status: 'Confirmation pending',
    };
  }
};

// GET /accounts
exports.index = async (ctx) => {
  const users = await User.find({});
  users.forEach(user => user.toJSON());
  ctx.body = {
    users,
  };
};

// POST /accounts
exports.create = async (ctx) => {
  const {
    firstName, lastName, email, password,
  } = ctx.request.body;
  const user = new User({
    firstName,
    lastName,
    email,
    password,
  });
  await user.save();
  ctx.body = {
    user: user.toJSON(),
  };
};

// GET /accounts/1
exports.read = async (ctx) => {
  const user = await User.findById(ctx.params.userID);
  ctx.body = {
    user: user.toJSON(),
  };
};

// PATCH/PUT /accounts/1
exports.update = async (ctx) => {
  const user = await User.findById(ctx.params.userID);
  const requestData = Object.keys(ctx.request);

  if (requestData.includes('body')) Object.assign(user, ctx.request.body);

  if (requestData.includes('files')) {
    const { photo } = ctx.request.files;
    if (photo) {
      user.photo = await uploadS3(config.get('aws').userPhotoFolder, photo);
    }
  }
  await user.save();
  ctx.body = {
    user: user.toJSON(),
  };
};

// DELETE /accounts/1
exports.destroy = async (ctx) => {
  const user = await User.findByIdAndDelete(ctx.params.userID);
  ctx.body = {
    user: user.toJSON(),
  };
};
