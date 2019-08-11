const config = require('config');
const uuid = require('uuid/v4');
const jwt = require('jsonwebtoken');

const Token = require('../accounts/models/token');

const generateAccessToken = (payload) => {
  payload.type = 'access';
  const { secret } = config.get('jwtSecret').accessToken;
  const opts = {
    expiresIn: config.get('jwtSecret').accessToken.expirationTime,
  };
  return jwt.sign(payload, secret, opts);
};

const generateRefreshToken = () => {
  const payload = {
    id: uuid(),
    type: 'refresh',
  };
  const { secret } = config.get('jwtSecret').refreshToken;
  const opts = {
    expiresIn: config.get('jwtSecret').refreshToken.expirationTime,
  };
  return {
    id: payload.id,
    token: jwt.sign(payload, secret, opts),
  };
};

const generateAndUpdateTokens = async (payload, userID) => {
  const accessToken = `JWT ${generateAccessToken(payload)}`;
  const refreshToken = generateRefreshToken();

  const update = Token.findOneAndUpdate({ userID }, {
    tokenID: refreshToken.id,
    userID,
  }, { upsert: true });
  await update.exec();

  return {
    accessToken,
    refreshToken,
  };
};

const verifyRefreshToken = async token => jwt.verify(token.replace(/JWT/, '').trim(), config.get('jwtSecret').refreshToken.secret, { json: true });

module.exports = {
  generateAndUpdateTokens,
  verifyRefreshToken,
};
