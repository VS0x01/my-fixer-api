module.exports = {
  port: 4567,
  databaseUrl: `mongodb+srv://VS_0x01:${process.env.DATABASE_PASSWORD}@cluster0-ubsb2.gcp.mongodb.net/test?retryWrites=true&w=majority`,
  crypto: {
    hash: {
      length: 128,
      iterations: 100000,
    },
  },
  jwtSecret: 'McQfTjWnZr4u7x!A',
};
