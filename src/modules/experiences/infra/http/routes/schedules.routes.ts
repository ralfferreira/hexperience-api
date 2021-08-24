import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import SchedulesController from '../controllers/SchedulesController';

import ensureHostPrivilege from '../middlewares/ensureHostPrivilege';

const schedulesRouter = Router();
const schedulesController = new SchedulesController();

schedulesRouter.post(
  '/',
  ensureHostPrivilege,
  celebrate({
    [Segments.BODY]: {
      date: Joi.date().required(),
      max_guests: Joi.number().integer().required()
    }
  }),
  schedulesController.create
);

export default schedulesRouter;
