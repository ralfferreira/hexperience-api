import { Router } from 'express';

import BlockedExperiencesController from '../controllers/BlockedExperiencesController';
import BlockedHostsController from '../controllers/BlockedHostsController';

const blockedRouter = Router();
const blockedExperiencesController = new BlockedExperiencesController();
const blockedHostsController = new BlockedHostsController();

blockedRouter.get(
  '/experiences',
  blockedExperiencesController.index
);

blockedRouter.get(
  '/hosts',
  blockedHostsController.index
)

export default blockedRouter;
