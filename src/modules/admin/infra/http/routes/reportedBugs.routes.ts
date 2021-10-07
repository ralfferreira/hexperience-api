import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import AppBugsController from '../controllers/AppBugsController';

const reportedBugsRouter = Router();
const appBugsController = new AppBugsController();

reportedBugsRouter.get(
  '/',
  appBugsController.index
);

reportedBugsRouter.patch(
  '/:bug_id',
  celebrate({
    [Segments.BODY]: {
      resolved: Joi.boolean().required()
    }
  }),
  appBugsController.update
);

export default reportedBugsRouter;
