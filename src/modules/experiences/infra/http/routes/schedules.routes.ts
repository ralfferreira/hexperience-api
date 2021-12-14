import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import SchedulesController from '../controllers/SchedulesController';

import ensureHostPrivilege from '../middlewares/ensureHostPrivilege';

const schedulesRouter = Router();
const schedulesController = new SchedulesController();

schedulesRouter.use(ensureHostPrivilege);

schedulesRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      date: Joi.date().required(),
      experience_id: Joi.number().integer().required()
    }
  }),
  schedulesController.create
);

schedulesRouter.delete(
  '/',
  celebrate({
    [Segments.BODY]: {
      schedule_id: Joi.number().integer().required(),
      host_id: Joi.number().integer().required()
    }
  }),
  schedulesController.delete
);

export default schedulesRouter;
