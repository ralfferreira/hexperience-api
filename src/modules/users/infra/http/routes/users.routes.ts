import { Router } from 'express';
import multer from 'multer';
import { celebrate, Segments, Joi } from 'celebrate';

import uploadConfig from '@config/upload';

import ensureAuthenticated from '../middleware/ensureAuthenticated';

import UsersController from '../controllers/UsersController';
import UserAvatarController from '../controllers/UserAvatarController';

const usersRouter = Router();
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

const upload = multer(uploadConfig.multer);

usersRouter.post(
  '/signUp',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required().min(6)
    }
  }),
  usersController.signUp
);

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required().min(6)
    }
  }),
  usersController.create
);

usersRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().required().uuid()
    }
  }),
  usersController.update
)

usersRouter.patch(
  '/avatar', 
  ensureAuthenticated, 
  upload.single('avatar'), 
  userAvatarController.update
);

export default usersRouter;
