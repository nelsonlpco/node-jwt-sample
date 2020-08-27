import * as dotenv from 'dotenv';

dotenv.config();

export default {
  mongodbUri: process.env.MONGODB_URI || '',
  mongodbAdminUser: process.env.MONGODB_ADMINUSERNAME || '',
  mongodbAdminPassword: process.env.MONGODB_ADMINPASSWORD || '',
  serverPort: Number(process.env.SERVER_PORT) || 3000,
  accessTokenSecrete: process.env.ACCESSTOKEN_SECRETE || '',
  refreshTokenSecrete: process.env.REFRESHTOKEN_SECRETE || '',
};
