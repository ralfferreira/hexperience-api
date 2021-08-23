import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import SchedulesController from '../controllers/SchedulesController';

const schedulesRouter = Router();
const schedulesController = new SchedulesController();

schedulesRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      date: Joi.date().required(),
      max_guests: Joi.number().integer().required(),
      experience_id: Joi.number().integer().required()
    }
  }),
  schedulesController.create
);

export default schedulesRouter;
