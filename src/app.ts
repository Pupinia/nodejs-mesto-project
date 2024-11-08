import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

import userRoutes from './routes/users';
import cardRoutes from './routes/cards';

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req: Request, _res: Response, next: NextFunction) => {
  const userId = '672dd9e48abef0418d2f827e';
  req.user = {
    _id: userId,
  };

  next();
});

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
