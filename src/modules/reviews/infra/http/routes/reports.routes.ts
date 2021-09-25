import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middleware/ensureAuthenticated';

import ExperienceReportsController from '../controllers/ExperienceReportsController';
import HostReportsController from '../controllers/HostReportsController';

const reportsRouter = Router();
const experienceReportsController = new ExperienceReportsController();
const hostReportsController = new HostReportsController();

reportsRouter.post(
  '/experiences/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      comment: Joi.string().required(),
      reason: Joi.string().required(),
      exp_id: Joi.number().integer().min(1).required()
    }
  }),
  experienceReportsController.create
);

reportsRouter.post(
  '/hosts/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      comment: Joi.string().required(),
      reason: Joi.string().required(),
      host_id: Joi.number().integer().min(1).required()
    }
  }),
  hostReportsController.create
);

export default reportsRouter;
