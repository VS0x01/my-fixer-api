module.exports = {
  port: process.env.PORT,
  databaseUrl: process.env.DATABASE_URL,
  crypto: {
    hash: {
      length: 128,
      iterations: 100000,
    },
  },
  jwtSecret: {
    accessToken: {
      secret: process.env.JWT_SECRET_ACCESS_TOKEN,
      expirationTime: '1h',
    },
    refreshToken: {
      secret: process.env.JWT_SECRET_REFRESH_TOKEN,
      expirationTime: '1d',
    },
  },
};
