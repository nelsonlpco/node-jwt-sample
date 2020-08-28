import * as dotenv from 'dotenv';

dotenv.config();

export default {
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
  mongodbDatabaseName: process.env.MONGODB_DATABASENAME || '',
  mongodbAdminUser: process.env.MONGODB_ADMINUSERNAME || '',
  mongodbAdminPassword: process.env.MONGODB_ADMINPASSWORD || '',
  serverPort: Number(process.env.SERVER_PORT) || 3000,
  accessTokenSecrete: process.env.ACCESSTOKEN_SECRETE || '',
  refreshTokenSecrete: process.env.REFRESHTOKEN_SECRETE || '',
  redisPort: Number(process.env.REDIS_PORT) || 6379,
  redisHost: process.env.REDIS_HOST || 'localhost',
};
