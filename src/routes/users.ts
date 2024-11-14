import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import {
  findUser,
  findUsers,
  updateAvatar,
  updateUser,
  getUser,
} from '../controllers/users';

const router = Router();

router.get('/me', getUser);

router.get('/', findUsers);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().alphanum().length(24),
  }),
}), findUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    about: Joi.string().required(),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().uri(),
  }),
}), updateAvatar);

export default router;
