import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ReportsController from '../controllers/ReportsController';
import ensureAuthenticated from '@modules/users/infra/http/middleware/ensureAuthenticated';

const reportsRouter = Router();
const reportsController = new ReportsController();

reportsRouter.post(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      comment: Joi.string().required(),
      reason: Joi.string().required(),
      exp_id: Joi.number().integer().min(1).required()
    }
  }),
  reportsController.create
);

export default reportsRouter;
