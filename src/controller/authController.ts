import { NextFunction, Request, Response } from 'express';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from 'helpers/jwt-manager';
import redisClient from 'helpers/redis-client';
import createHttpError from 'http-errors';
import UserModel from 'models/UserModel';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    const doesExists = await UserModel.findOne({ email });

    if (doesExists) {
      throw new createHttpError.Conflict();
    }

    const newUser = new UserModel({ email, password });
    const savedUser = await newUser.save();

    const accessToken = await signAccessToken(savedUser.id);
    const refreshToken = await signRefreshToken(savedUser.id);

    res.send({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) throw new createHttpError.NotFound('User not registered');

    const isMatch = await user.isValidPassword(password);

    if (!isMatch) {
      throw new createHttpError.Unauthorized('Username or password is invalid');
    }

    const accessToken = await signAccessToken(user.id);
    const refreshToken = await signRefreshToken(user.id);

    res.send({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};

const refreshTokenLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) throw new createHttpError.BadRequest();

    const userId = await verifyRefreshToken(refreshToken);

    const accessToken = await signAccessToken(userId);
    const newRefreshToken = await signRefreshToken(userId);

    res.send({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    next(error);
  }
};

const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new createHttpError.BadRequest();

    const userId = await verifyRefreshToken(refreshToken);
    redisClient.DEL(userId, (err, val) => {
      if (err) {
        throw new createHttpError.InternalServerError();
      }

      res.sendStatus(204);
    });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  refreshTokenLogin,
  logout,
};
