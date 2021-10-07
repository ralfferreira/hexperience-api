import { Router } from 'express';

import AppBugsController from '../controllers/AppBugsController';

const reportedBugsRouter = Router();
const appBugsController = new AppBugsController();

reportedBugsRouter.get(
  '/',
  appBugsController.index
);

export default reportedBugsRouter;
