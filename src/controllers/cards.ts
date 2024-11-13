import { NextFunction, Request, Response } from 'express';

import Card from '../models/card';

import NotFoundError from '../errors/not-found-err';
import BadRequest from '../errors/bad-request-err';
import InternalServerError from '../errors/internal-server-err';
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
        throw new BadRequest('Переданы некорректные данные при создании карточки');
      }
      throw new InternalServerError('На сервере произошла ошибка');
    }).catch(next);
};

export const getCards = (_req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Переданы некорректные данные при создании карточки');
      }
      throw new InternalServerError('На сервере произошла ошибка');
    }).catch(next);
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  Card.findById(cardId)
    .then((card) => {
      // eslint-disable-next-line no-underscore-dangle
      if (card?.owner.toString() !== _id._id) {
        return Promise.reject(new Forbidden('У вас нет прав на это действие'));
      }

      return Card.findByIdAndDelete(cardId)
        .then((deletedCard) => {
          if (!deletedCard) {
            return Promise.reject(new NotFoundError('Карточка с указанным _id не найдена'));
          }

          return deletedCard;
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      throw new InternalServerError('На сервере произошла ошибка');
    })
    .catch(next);
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
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
        throw new BadRequest('Переданы некорректные данные для постановки/снятии лайка');
      }
      if (err.name === 'CastError') {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      throw new InternalServerError('На сервере произошла ошибка');
    }).catch(next);
};

export const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
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
        throw new BadRequest('Переданы некорректные данные для постановки/снятии лайка');
      }
      if (err.name === 'CastError') {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      throw new InternalServerError('На сервере произошла ошибка');
    }).catch(next);
};
