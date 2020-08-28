/* eslint-disable no-console */
import environment from 'config/environment';
import redis from 'redis';

const redisClient = redis.createClient({
  port: environment.redisPort,
  host: environment.redisHost,
});

redisClient.on('connect', () => {
  console.log('Client connected to redis.');
});

redisClient.on('read', () => {
  console.log('Client connecte to redis and ready to use.');
});

redisClient.on('error', (err) => {
  console.log('Redis error: ', err.message);
});

redisClient.on('end', () => {
  console.log('client disconnected from redis');
});

process.on('SIGINT', () => {
  redisClient.quit();

  process.exit(0);
});

export default redisClient;
