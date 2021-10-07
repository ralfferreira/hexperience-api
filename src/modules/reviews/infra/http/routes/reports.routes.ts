import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middleware/ensureAuthenticated';

import ExperienceReportsController from '../controllers/ExperienceReportsController';
import HostReportsController from '../controllers/HostReportsController';
import AppBugsReportsController from '../controllers/AppBugsReportsController';

const reportsRouter = Router();
const experienceReportsController = new ExperienceReportsController();
const hostReportsController = new HostReportsController();
const appBugReportsController = new AppBugsReportsController();

reportsRouter.use(ensureAuthenticated);

reportsRouter.post(
  '/experiences/',
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
  celebrate({
    [Segments.BODY]: {
      comment: Joi.string().required(),
      reason: Joi.string().required(),
      host_id: Joi.number().integer().min(1).required()
    }
  }),
  hostReportsController.create
);

reportsRouter.post(
  '/bugs/',
  celebrate({
    [Segments.BODY]: {
      what: Joi.string().required(),
      where: Joi.string().required(),
      description: Joi.string().required(),
    }
  }),
  appBugReportsController.create
);

export default reportsRouter;
