import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ExperiencesController from '@modules/experiences/infra/http/controllers/ExperiencesController';

import ensureHostPrivilige from '../middlewares/ensureHostPrivilige';
import schedulesRouter from './schedules.routes';

const experiencesRouter = Router();
const experiencesController = new ExperiencesController();

experiencesRouter.use(ensureHostPrivilige)

experiencesRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      duration: Joi.number().required().max(360),
      description: Joi.string().required(),
      price: Joi.number().required(),
      requirements: Joi.string(),
      parental_rating: Joi.number().min(0).required(),
      address: Joi.string(),
      latitude: Joi.number(),
      longitude: Joi.number(),
      is_online:Joi.boolean()
    }
  }),
  experiencesController.create
);

experiencesRouter.use('/schedules', schedulesRouter)

export default experiencesRouter;
