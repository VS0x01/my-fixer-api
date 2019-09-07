const config = require('config');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const ServerError = require('./ServerError');

const Token = require('../accounts/models/token');

const generateToken = (payload, secrets) => {
  const opts = {
    expiresIn: secrets.expirationTime,
  };
  return jwt.sign(payload, secrets.secret, opts);
};

const generateAuthTokens = async (payload, user) => {
  const accessToken = generateToken({
    ...payload,
    type: 'access'
  }, config.get('jwtSecret').accessToken);

  const refreshTokenID = new mongoose.Types.ObjectId();
  const refreshToken = generateToken({
    _id: refreshTokenID,
    type: 'refresh',
  }, config.get('jwtSecret').refreshToken);
  const refreshTokenFingerprint = new Token({ _id: refreshTokenID, user });
  await refreshTokenFingerprint.save();

  return {
    accessToken,
    refreshToken,
  };
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token.replace(/JWT/, '').trim(), config.get('jwtSecret').refreshToken.secret);
};

module.exports = {
  generateToken,
  generateAuthTokens,
  verifyRefreshToken,
};
