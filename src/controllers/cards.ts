import { Request, Response } from 'express';

import Card from '../models/card';

const badRequest = 400;
const notFound = 404;
const internalServerError = 500;

export const createCard = (req: Request, res: Response) => {
  const { _id } = req.user;
  const { name, link } = req.body;

  Card.create({
    name,
    link,
    owner: _id,
  })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({ message: 'Переданы некорректные данные при создании карточки' });
        return false;
      }
      return res.status(internalServerError).send({ message: 'На сервере произошла ошибка' });
    });
};

export const getCards = (_req: Request, res: Response) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({ message: 'Переданы некорректные данные при создании карточки' });
        return false;
      }
      return res.status(internalServerError).send({ message: 'На сервере произошла ошибка' });
    });
};

export const deleteCard = (req: Request, res: Response) => {
  const { cardId } = req.params;

  Card.findByIdAndDelete(cardId)
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(notFound).send({ message: 'Карточка с указанным _id не найдена' });
        return false;
      }
      return res.status(internalServerError).send({ message: 'На сервере произошла ошибка' });
    });
};

export const likeCard = (req: Request, res: Response) => {
  const { _id } = req.user;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: _id } },
    { new: true },
  )
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
        return false;
      }
      if (err.name === 'CastError') {
        res.status(notFound).send({ message: 'Передан несуществующий _id карточки' });
        return false;
      }
      return res.status(internalServerError).send({ message: 'На сервере произошла ошибка' });
    });
};

export const dislikeCard = (req: Request, res: Response) => {
  const { _id } = req.user;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: _id as any } },
    { new: true },
  )
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
        return false;
      }
      if (err.name === 'CastError') {
        res.status(notFound).send({ message: 'Передан несуществующий _id карточки' });
        return false;
      }
      return res.status(internalServerError).send({ message: 'На сервере произошла ошибка' });
    });
};
