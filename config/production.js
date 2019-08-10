module.exports = {
  port: process.env.PORT,
  databaseUrl: process.env.DATABASE_URL,
  crypto: {
    hash: {
      length: 128,
      iterations: 100000,
    },
  },
  jwtSecret: process.env.JWT_SECRET,
};
