import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import {
  createCard,
  likeCard,
  dislikeCard,
  getCards,
  deleteCard,
} from '../controllers/cards';

const router = Router();

router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    link: Joi.string().required(),
    owner: Joi.string().required(),
  }),
}), createCard);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
}), deleteCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
}), dislikeCard);

export default router;
