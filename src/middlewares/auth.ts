import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import AutorizationError from '../errors/autorization-err';

interface IJwtPayload extends JwtPayload {
  _id: string
}

export default (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new AutorizationError('Необходима авторизация');
    }

    const token = authorization.replace('Bearer ', '');

    const payload = jwt.verify(token, 'some-secret-key') as IJwtPayload;

    req.user = payload;
  } catch (err) {
    next(new AutorizationError('Необходима авторизация'));
  }

  return next();
};
