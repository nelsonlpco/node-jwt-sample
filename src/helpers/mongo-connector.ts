/* eslint-disable no-console */
import environment from 'config/environment';
import mongoose from 'mongoose';

async function initializeMongodb() {
  try {
    await mongoose.connect(environment.mongodbUri, {
      dbName: environment.mongodbDatabaseName,
      user: environment.mongodbAdminUser,
      pass: environment.mongodbAdminPassword,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('Mongodb is connected');

    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to db');
    });

    mongoose.connection.on('error', (error) => {
      console.log('Error on mongoose connection: ', error.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected.');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      process.exit(-1);
    });
  } catch (error) {
    console.log(`Error on connect to mongodb: ${error.message}`);
  }
}

export default initializeMongodb;
