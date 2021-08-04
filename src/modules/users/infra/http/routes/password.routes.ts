import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ForgotPasswordController from '../controllers/ForgotPasswordController';

const passwordRouter = Router();
const forgotPasswordController = new ForgotPasswordController();

passwordRouter.post(
  '/forgot',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required()
    }
  }),
  forgotPasswordController.create
);

passwordRouter.put(
  '/reset',
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().required().uuid(),
      password: Joi.string().required().min(6)
    }
  }),
  forgotPasswordController.update
);

export default passwordRouter;