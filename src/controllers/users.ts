import { Request, Response } from 'express';
import User from '../models/user';

const badRequest = 400;
const notFound = 404;
const internalServerError = 500;

export const createUser = (req: Request, res: Response) => {
  const {
    name, about, avatar,
  } = req.body;

  User.create({
    name,
    about,
    avatar,
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return false;
      }
      return res.status(internalServerError).send({ message: 'Произошла ошибка' });
    });
};

export const findUsers = (_req: Request, res: Response) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return false;
      }
      return res.status(internalServerError).send({ message: 'Произошла ошибка' });
    });
};

export const findUser = (req: Request, res: Response) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(notFound).send({ message: 'Пользователь по указанному _id не найден' });
        return false;
      }
      return res.status(internalServerError).send({ message: 'Произошла ошибка' });
    });
};

export const updateUser = (req: Request, res: Response) => {
  const { name, about } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(
    _id,
    { name, about },
    {
      new: true,
    },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({ message: 'Переданы некорректные данные при обновлении профиля' });
        return false;
      }
      if (err.name === 'CastError') {
        res.status(notFound).send({ message: 'Пользователь с указанным _id не найден' });
        return false;
      }
      return res.status(internalServerError).send({ message: 'Произошла ошибка' });
    });
};

export const updateAvatar = (req: Request, res: Response) => {
  const { _id } = req.user;
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    _id,
    { avatar },
    {
      new: true,
    },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({ message: 'Переданы некорректные данные при обновлении аватара' });
        return false;
      }
      if (err.name === 'CastError') {
        res.status(notFound).send({ message: 'Пользователь с указанным _id не найден' });
        return false;
      }
      return res.status(internalServerError).send({ message: 'Произошла ошибка' });
    });
};
