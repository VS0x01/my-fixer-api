const config = require('config');
const jwt = require('jsonwebtoken');

const generateToken = (payload, secrets) => {
  const opts = {
    expiresIn: secrets.expirationTime,
  };
  return jwt.sign(payload, secrets.secret, opts);
};

const generateAuthTokens = async (payload) => {
  const accessToken = generateToken({
    ...payload,
    type: 'access',
  }, config.get('jwtSecret').accessToken);

  const refreshToken = generateToken({
    ...payload,
    type: 'refresh',
  }, config.get('jwtSecret').refreshToken);

  return {
    accessToken,
    refreshToken,
  };
};

const verifyToken = (token, secret) => jwt.verify(token.replace(/JWT/, '').trim(), secret);

module.exports = {
  generateToken,
  generateAuthTokens,
  verifyToken,
};
