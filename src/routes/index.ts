import authController from 'controller/authController';
import express from 'express';
import { verifyAccessToken } from 'helpers/jwt-manager';

const router = express.Router();

router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);
router.post('/auth/refresh', authController.refreshTokenLogin);
router.delete('/auth/logout', authController.logout);

router.get('/teste', verifyAccessToken, (req, res, next) => {
  res.send('protected route');
});

export default router;
