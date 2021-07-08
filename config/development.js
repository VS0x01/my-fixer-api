module.exports = {
  port: 3000,
  cors: {
    origin: 'http://localhost:8080',
  },
  databaseUrl: `mongodb+srv://VS_0x01:${process.env.DATABASE_PASSWORD}@cluster0.ubsb2.gcp.mongodb.net/test?retryWrites=true&w=majority`,
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
  storage: {
    method: 'local',
    aws: {
      accessKeyID: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      bucketName: 'vs0x01-myfixer',
      userPhotoFolder: 'user-photos',
      defaultUserPhoto: 'https://vs0x01-myfixer.s3.eu-central-1.amazonaws.com/avatar_circle_blue_512dp.png',
    },
  },
  mailing: {
    sendGrid: {
      apiKey: process.env.SENDGRID_API_KEY,
    },
  },
};
