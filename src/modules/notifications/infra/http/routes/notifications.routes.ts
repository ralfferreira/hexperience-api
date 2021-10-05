import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middleware/ensureAuthenticated';

import NotificationsController from '../controllers/NotificationsController';

const notificationsRouter = Router();
const notificationsController = new NotificationsController();

notificationsRouter.use(ensureAuthenticated);

notificationsRouter.get(
  '/',
  notificationsController.index
);

export default notificationsRouter;
