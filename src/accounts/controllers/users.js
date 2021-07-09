/* eslint-disable no-underscore-dangle */
const config = require('config');
const path = require('path');
const fs = require('fs');
const passport = require('koa-passport');
const nunjucks = require('nunjucks');
const uploadS3 = require('../../utils/uploadS3');
const { uploadMongo } = require('../../utils/gridfsMongo');
const sendEmail = require('../../utils/mailing');

const jwt = require('../../utils/jwt');
const User = require('../models/user');

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
      const tokens = await jwt.generateAuthTokens(payload);
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
  const decodedToken = jwt.verifyToken(ctx.header.authorization, config.get('jwtSecret').refreshToken.secret);

  const payload = decodedToken;
  delete payload.iat;
  delete payload.exp;
  delete payload.type;
  const tokens = await jwt.generateAuthTokens(payload);

  ctx.body = {
    accessToken: `JWT ${tokens.accessToken}`,
    refreshToken: `JWT ${tokens.refreshToken}`,
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
  users.forEach((user) => user.toJSON());
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
      const uploadMethod = config.get('storage').method;
      switch (uploadMethod) {
        case 'mongo':
          user.photo = await new Promise((resolve) => {
            uploadMongo(user._id, photo, resolve);
          });
          break;
        case 'aws':
          user.photo = await uploadS3(config.get('storage').userPhotoFolder, photo);
          break;
        default:
          break;
      }
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
