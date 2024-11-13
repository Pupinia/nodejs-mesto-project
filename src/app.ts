import express, {
  NextFunction,
  Request, Response,
} from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';

import {
  PORT, HOST, NAME_DB, PORT_DB,
} from './config';

import userRoutes from './routes/users';
import cardRoutes from './routes/cards';

import { login, createUser } from './controllers/users';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';

const app = express();

mongoose.connect(`mongodb://${HOST}:${PORT_DB}/${NAME_DB}`);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(requestLogger);

app.post('/signup', createUser);
app.post('/signin', login);

app.use(auth);

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

app.use(errorLogger);

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
