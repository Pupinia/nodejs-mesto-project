// middlewares/auth.ts
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// interface IUser {
//   name: string;
//   about: string;
//   avatar: string;
//   password: string;
//   email: string;
// }

import AutorizationError from '../errors/autorization-err';

export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AutorizationError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new AutorizationError('Необходима авторизация');
  }

  req.user = { _id: payload };

  return next();
};
