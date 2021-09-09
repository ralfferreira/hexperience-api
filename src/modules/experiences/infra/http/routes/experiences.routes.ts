import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ExperiencesController from '@modules/experiences/infra/http/controllers/ExperiencesController';

import ensureHostPrivilege from '../middlewares/ensureHostPrivilege';
import schedulesRouter from './schedules.routes';
import ensureAuthenticated from '@modules/users/infra/http/middleware/ensureAuthenticated';

const experiencesRouter = Router();
const experiencesController = new ExperiencesController();

experiencesRouter.post(
  '/',
  ensureHostPrivilege,
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      duration: Joi.number().required().max(360),
      description: Joi.string().required(),
      price: Joi.number().required(),
      requirements: Joi.string(),
      parental_rating: Joi.number().min(0).required(),
      max_guests: Joi.number().integer().required().min(1),
      address: Joi.string(),
      latitude: Joi.number(),
      longitude: Joi.number(),
      is_online: Joi.boolean(),
      category_id: Joi.number().integer().required().min(1)
    }
  }),
  experiencesController.create
);

experiencesRouter.get(
  '/:exp_id/show',
  ensureAuthenticated,
  experiencesController.show
)

experiencesRouter.put(
  '/',
  ensureHostPrivilege,
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      duration: Joi.number().required().max(360),
      description: Joi.string().required(),
      price: Joi.number().required(),
      requirements: Joi.string(),
      parental_rating: Joi.number().min(0).required(),
      max_guests: Joi.number().integer().required().min(1),
      address: Joi.string(),
      latitude: Joi.number(),
      longitude: Joi.number(),
      is_online:Joi.boolean(),
      experience_id: Joi.number().integer().required()
    }
  }),
  experiencesController.update
)

experiencesRouter.get(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().optional(),
      min_duration: Joi.number().integer().min(1).optional(),
      max_duration: Joi.number().integer().max(360).optional(),
      min_price: Joi.number().min(0).optional(),
      max_price: Joi.number().optional(),
      parental_rating: Joi.number().min(0).optional(),
      is_online: Joi.boolean().optional(),
      categories:
        Joi.array().items(
          Joi.number().integer().min(1)
        ).optional(),
    }
  }),
  experiencesController.index
)

experiencesRouter.use('/schedules', schedulesRouter)

export default experiencesRouter;
