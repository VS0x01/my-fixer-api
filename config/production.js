module.exports = {
  port: process.env.PORT,
  cors: {
    origin: process.env.CLIENT_DOMAIN,
  },
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
  storage: {
    method: process.env.STORAGE_METHOD,
    userPhotoFolder: process.env.USER_PHOTO_FOLDER,
    aws: {
      accessKeyID: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      bucketName: process.env.AWS_BUCKET_NAME,
      defaultUserPhoto: process.env.AWS_DEFAULT_USER_PHOTO,
    },
  },
  mailing: {
    sendGrid: {
      apiKey: process.env.SENDGRID_API_KEY,
    },
  },
};
