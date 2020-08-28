import environment from 'config/environment';
import express from 'express';
import initializeMongodb from 'helpers/mongo-connector';
import 'helpers/redis-client';
import createError from 'http-errors';
import morgan from 'morgan';
import router from 'routes';

initializeMongodb();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.use('/api', router);

app.use(async (req, res, next) => {
  next(new createError.NotFound());
});

app.use((error: any, _: any, res: any, next: any) => {
  res.status(error.status || 500);
  res.send({
    error: {
      status: error.status || 500,
      message: error.message,
    },
  });
});

app.listen(environment.serverPort, () => {
  console.log(`Server is running on ${environment.serverPort}`);
});
