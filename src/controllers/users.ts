import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user';

import NotFoundError from '../errors/not-found-err';
import BadRequest from '../errors/bad-request-err';
import InternalServerError from '../errors/internal-server-err';
import NotUnique from '../errors/not-unique-err';
import AutorizationError from '../errors/autorization-err';

const notUniqueCode = 11000;

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.code === notUniqueCode) {
        throw new NotUnique('Переданный Email не уникальный');
      }
      if (err.name === 'ValidationError') {
        throw new BadRequest('Переданы некорректные данные при создании пользователя');
      }
      throw new InternalServerError('На сервере произошла ошибка');
    })
    .catch(next);
};

export const findUsers = (_req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Переданы некорректные данные при создании пользователя');
      }
      throw new InternalServerError('На сервере произошла ошибка');
    })
    .catch(next);
};

export const findUser = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      throw new InternalServerError('На сервере произошла ошибка');
    }).catch(next);
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
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
        throw new BadRequest('Переданы некорректные данные при обновлении профиля');
      }
      if (err.name === 'CastError') {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      throw new InternalServerError('На сервере произошла ошибка');
    }).catch(next);
};

export const updateAvatar = (req: Request, res: Response, next: NextFunction) => {
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
        throw new BadRequest('Переданы некорректные данные при обновлении профиля');
      }
      if (err.name === 'CastError') {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      throw new InternalServerError('На сервере произошла ошибка');
    }).catch(next);
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then(({ _id }) => {
      // TODO: Мы рекомендуем записывать JWT в httpOnly куку
      // TODO: В ответ на успешную авторизацию контроллер _id с
      // login возвращает клиенту созданный токен — это может быть тело ответа
      //  или заголовок Set-Cookie ;
      const token = jwt.sign({ _id }, 'some-secret-key', { expiresIn: '7d' });

      res.send({ token });
    })
    .catch(() => {
      // Передавать правильную ошибку
      throw new AutorizationError('Ошибка авторизации');
    }).catch(next);
};

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.user;

  User.findById(_id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }

      res.send(user);
    })
    .catch(next);
};
