import environment from 'config/environment';
import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import redisClient from './redis-client';

export const signAccessToken = (userId: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const payload = {};
    const secret = environment.accessTokenSecrete;
    const options = {
      expiresIn: '1h',
      issuer: 'nelson@gmail.com',
      audience: userId,
    };

    jwt.sign(payload, secret, options, (err, token) => {
      if (err) reject(new createHttpError.InternalServerError());

      resolve(token);
    });
  });
};

export const signRefreshToken = (userId: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const payload = {};
    const secret = environment.refreshTokenSecrete;
    const options = {
      expiresIn: '1y',
      issuer: 'nelson@gmail.com',
      audience: userId,
    };
    const refreshTokenExpiration = 365 * 24 * 60 * 60;

    jwt.sign(payload, secret, options, (err, token = '') => {
      if (err) reject(new createHttpError.InternalServerError());

      redisClient.SET(userId, token, 'EX', refreshTokenExpiration, (error) => {
        if (error) {
          reject(new createHttpError.InternalServerError());
        }
      });

      resolve(token);
    });
  });
};

export const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return next(new createHttpError.Unauthorized());

  const token = authHeader.split(' ')[1];

  jwt.verify(token, environment.accessTokenSecrete, (err, payload) => {
    if (err) {
      const errorMessage = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;

      return next(new createHttpError.Unauthorized(errorMessage));
    }

    req.body.payload = payload;
    next();
  });
};

export const verifyRefreshToken = (refreshToken: string): Promise<string> =>
  new Promise<string>((resolve, reject) => {
    jwt.verify(refreshToken, environment.refreshTokenSecrete, (err, payload: any) => {
      if (err) return reject(new createHttpError.Unauthorized());

      const userId = payload.aud;

      redisClient.GET(userId, (redisError, result) => {
        if (redisError) reject(new createHttpError.InternalServerError());

        if (refreshToken === result) return resolve(userId);

        reject(new createHttpError.Unauthorized());
      });
    });
  });
