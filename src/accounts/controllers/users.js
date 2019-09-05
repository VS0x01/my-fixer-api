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

// POST /accounts/sign-in
exports.signIn = async (ctx, next) => {
  await passport.authenticate('local', async (err, user) => {
    if (user) {
      const { fullName, email, photo } = user;
      const payload = {
        id: user._id,
        role: user.role,
      };
      const tokens = await jwt.generateAndUpdateTokens(payload, user._id);
      const { accessToken, refreshToken } = tokens;
      ctx.body = {
        user: {
          fullName,
          email,
          photo,
        },
        accessToken: `JWT ${accessToken}`,
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
  const decodedRefreshToken = await jwt.verifyRefreshToken(ctx.header.authorization);
  const refreshToken = await Token.findOne({ tokenID: decodedRefreshToken.id });
  if (!refreshToken) {
    ctx.throw(404, 'token not found');
  } else if (decodedRefreshToken.type !== 'refresh') ctx.throw(404, 'invalid token');

  const user = await User.findById(refreshToken.userID);
  const payload = {
    id: user._id,
    role: user.role,
  };
  const tokens = await jwt.generateAndUpdateTokens(payload, refreshToken.userID);
  ctx.body = {
    accessToken: `JWT ${tokens.accessToken}`,
    refreshToken: `JWT ${tokens.refreshToken.token}`,
  };
};

// POST /accounts/confirm
exports.emailSend = async (ctx) => {
  const attachments = [
    {
      content: Buffer.from(fs.readFileSync('./src/assets/sarah_freeman.png')).toString('base64'),
      filename: 'sarah_freeman.png',
    },
  ];
  const origin = ctx.request.headers.referer;
  console.log(ctx, origin);
  const tokens = await jwt.generateAndUpdateTokens({
    id: 'tmpHardcodedUserID',
    role: 'tmpHardcodedUserRole',
  });

  await sendEmail(
    'vadim.a.shesterikov@gmail.com',
    'service@myfixer.com',
    'Account confirmation',
    nunjucks.render('confirm_account.njk', {
      user: 'tmpHardcodedUser',
      origin,
      token: tokens.accessToken,
    }),
    attachments,
  );
  ctx.body = {
    accessToken: `JWT ${tokens.accessToken}`,
    refreshToken: `JWT ${tokens.refreshToken.token}`,
  };
};

/* exports.updatePhoto = async (ctx) => {
  const photo = await uploadS3(config.get('aws').userPhotoFolder, ctx.request.files.photo);
  await User.findByIdAndUpdate(ctx.state.user._id, { photo });
  ctx.body = {
    photo,
  };
}; */

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
  await user.save();
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
