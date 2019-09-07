const config = require('config');
const path = require('path');
const fs = require('fs');
const passport = require('koa-passport');
const nunjucks = require('nunjucks');
const ServerError = require('../../utils/ServerError');
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
        confirmed: user.confirmed,
      };
      const tokens = await jwt.generateAuthTokens(payload, user);
      const { accessToken, refreshToken } = tokens;
      ctx.body = {
        user: {
          fullName,
          email,
          photo,
        },
        accessToken: `JWT ${accessToken}`,
        refreshToken: `JWT ${refreshToken}`,
      };
    } else {
      throw new ServerError(403, err);
    }
  })(ctx, next);
};

// GET /accounts/token
exports.token = async (ctx) => {
  const decodedRefreshToken = jwt.verifyRefreshToken(ctx.header.authorization);
  const refreshToken = await Token.findById(decodedRefreshToken._id).populate('user');
  if (!refreshToken) {
    throw new ServerError(404, 'token not found');
  } else if (decodedRefreshToken.type !== 'refresh') throw new ServerError(403, 'invalid token');

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
  if(all) {
    await Token.deleteMany({ user: ctx.state.user._id });
  } else if(refreshToken) {
    const decodedRefreshToken = jwt.verifyRefreshToken(refreshToken);
    await Token.findOneAndRemove(decodedRefreshToken._id);
  }
  ctx.body = {
    success: true,
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
