module.exports = {
  port: process.env.PORT,
  databaseUrl: process.env.DATABASE_URL,
  crypto: {
    hash: {
      length: process.env.CRYPTO_HASH_LENGTH,
      iterations: process.env.CRYPTO_HASH_LENGTH_ITERATIONS,
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
};
