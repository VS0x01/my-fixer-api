const config = require('config');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

const User = require('../../accounts/models/user');

const opts = {
  secretOrKey: config.get('jwtSecret').accessToken.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
};

module.exports = new JwtStrategy(opts, (jwtPayload, done) => {
  User.findById(jwtPayload.id, (err, user) => {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  });
});
