import { Router } from 'express';
import {
  findUser,
  findUsers,
  updateAvatar,
  createUser,
  updateUser,
} from '../controllers/users';

const router = Router();

router.get('/', findUsers);
router.get('/:userId', findUser);

router.post('/', createUser);

router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

export default router;
