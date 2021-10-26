import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import SessionsController from '../controllers/SessionsController';

const sessionsRouter = Router();
const sessionsController = new SessionsController();

sessionsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8)
    }
  }),
  sessionsController.create
);

sessionsRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      user_id: Joi.number().required().integer(),
      token: Joi.string().required()
    }
  }),
  sessionsController.update
);

export default sessionsRouter;
