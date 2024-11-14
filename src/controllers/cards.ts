import { NextFunction, Request, Response } from 'express';

import Card from '../models/card';

import NotFoundError from '../errors/not-found-err';
import BadRequest from '../errors/bad-request-err';
import Forbidden from '../errors/forbidden-err';

export const createCard = (req: Request, res: Response, next: NextFunction) => {
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
        next(new BadRequest('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

export const getCards = (_req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      next(err);
    });
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        return Promise.reject(new NotFoundError('Карточка с указанным _id не найдена'));
      }

      if (card?.owner.toString() !== _id) {
        return Promise.reject(new Forbidden('У вас нет прав на это действие'));
      }

      return Card.findByIdAndDelete(cardId).then((deletedCard) => res.send(deletedCard));
    })
    .catch((err) => {
      next(err);
    });
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.user;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: _id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Передан несуществующий _id карточки'));
      } else {
        next(err);
      }
    });
};

export const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.user;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: _id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Передан несуществующий _id карточки'));
      } else {
        next(err);
      }
    });
};
