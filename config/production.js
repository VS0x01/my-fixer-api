module.exports = {
  port: process.env.PORT,
  databaseUrl: process.env.DATABASE_URL,
  crypto: {
    hash: {
      length: Number(process.env.CRYPTO_HASH_LENGTH),
      iterations: Number(process.env.CRYPTO_HASH_LENGTH_ITERATIONS),
    },
  },
  jwtSecret: {
    accessToken: {
      secret: process.env.JWT_SECRET_ACCESS_TOKEN,
      expirationTime: process.env.JWT_SECRET_ACCESS_TOKEN_EXPIRATION_TIME,
    },
    refreshToken: {
      secret: process.env.JWT_SECRET_REFRESH_TOKEN,
      expirationTime: process.env.JWT_SECRET_REFRESH_TOKEN_EXPIRATION_TIME,
    },
  },
  mailing: {
    apiKey: process.env.SENDGRID_API_KEY,
  },
};
