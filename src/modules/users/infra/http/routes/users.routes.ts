import { Router } from 'express';
import multer from 'multer';
import { celebrate, Segments, Joi } from 'celebrate';

import storageConfig from '@config/storage';

import ensureAuthenticated from '../middleware/ensureAuthenticated';

import UsersController from '../controllers/UsersController';
import UserAvatarController from '../controllers/UserAvatarController';

const usersRouter = Router();
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

const upload = multer(storageConfig.multer);

// /^\+[0-9]+\)\s\d\d\d\d\d-\d\d\d\d$/i => REGEX FOR PHONE NUMBER

usersRouter.post(
  '/sign-up',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone_number: Joi.string().optional(),
      password: Joi.string().required().min(8)
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
      phone_number: Joi.string().optional(),
      password: Joi.string().required().min(8)
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
