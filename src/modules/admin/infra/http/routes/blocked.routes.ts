import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import BlockedExperiencesController from '../controllers/BlockedExperiencesController';
import BlockedHostsController from '../controllers/BlockedHostsController';

const blockedRouter = Router();
const blockedExperiencesController = new BlockedExperiencesController();
const blockedHostsController = new BlockedHostsController();

blockedRouter.get(
  '/experiences',
  blockedExperiencesController.index
);

blockedRouter.put(
  '/experiences',
  celebrate({
    [Segments.BODY]: {
      exp_id: Joi.number().integer().min(1).required(),
    }
  }),
  blockedExperiencesController.update
)

blockedRouter.get(
  '/hosts',
  blockedHostsController.index
)

export default blockedRouter;
