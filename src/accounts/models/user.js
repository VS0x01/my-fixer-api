/* eslint-disable func-names */
const crypto = require('crypto');
const config = require('config');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    default: config.get('aws').defaultUserPhoto,
  },
  country: {
    type: String,
  },
  role: {
    type: String,
    default: 'user',
  },
  email: {
    type: String,
    unique: 'Two users cannot share the same email ({VALUE})',
    required: true,
    validate: {
      validator: function checkEmail(value) {
        const re = /^(\S+)@([a-z0-9-]+)(\.)([a-z]{2,4})(\.?)([a-z]{0,4})+$/;
        return re.test(value);
      },
      message: props => `${props.value} is not a valid email.`,
    },
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  encryptedPassword: {
    type: String,
  },
  salt: {
    type: String,
  },
}, { timestamps: true });

userSchema.virtual('password')
  .set(function (password) {
    if (password !== undefined) {
      if (!password) this.invalidate('password', 'Password can\'t be empty!');
      else if (password.length < 6) this.invalidate('password', 'Password can\'t be less than 6 symbols!');
      else {
        this.salt = crypto.randomBytes(config.get('crypto').hash.length).toString('hex');
        this.encryptedPassword = crypto
          .pbkdf2Sync(password, this.salt, config.get('crypto').hash.iterations, config.get('crypto').hash.length, 'sha512')
          .toString('hex');
      }
    } else {
      this.salt = undefined;
      this.encryptedPassword = undefined;
    }
  });

userSchema.methods.checkPassword = function (password) {
  if (!(password && this.encryptedPassword)) return false;
  return crypto
    .pbkdf2Sync(password, this.salt, config.get('crypto').hash.iterations, config.get('crypto').hash.length, 'sha512')
    .toString('hex') === this.encryptedPassword;
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.encryptedPassword;
  delete obj.salt;
  // eslint-disable-next-line no-underscore-dangle
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
