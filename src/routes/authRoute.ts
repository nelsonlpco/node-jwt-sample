import register from 'controller/UserController';
import { Router } from 'express';
import server from 'server';

const router = Router();

router.post('/register', async (req, res, next) => {
  const result = await register(req.body.email, req.body.password);

  res.send(result);
});

server.addRoute('/auth', router);

