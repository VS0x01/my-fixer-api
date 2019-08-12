module.exports = {
  port: 4567,
  databaseUrl: `mongodb+srv://VS_0x01:${process.env.DATABASE_PASSWORD}@cluster0-ubsb2.gcp.mongodb.net/test?retryWrites=true&w=majority`,
  crypto: {
    hash: {
      length: 128,
      iterations: 100000,
    },
  },
  jwtSecret: {
    accessToken: {
      secret: 'McQfTjWnZr4u7x!A',
      expirationTime: '2m',
    },
    refreshToken: {
      secret: '214c75df7b7424bdd89630bbe49eb2452075af582309fab40efdb53d107edde9',
      expirationTime: '3m',
    },
  },
  mailing: {
    apiKey: process.env.SENDGRID_API_KEY,
  },
};
