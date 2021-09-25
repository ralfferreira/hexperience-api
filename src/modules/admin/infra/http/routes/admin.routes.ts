import { Router } from "express";
import { celebrate, Segments, Joi } from "celebrate";

import DecideHostRequestController from "../controllers/DecideHostRequestController";
import ResolveReportsController from "../controllers/ResolveReportsController";
import UserStatusController from "../controllers/UserStatusController";

import ensureAdminAuthenticated from "../middlewares/ensureAdminAuthenticated";

const adminRouter = Router();
const decideHostRequestController = new DecideHostRequestController();
const resolveReportsController = new ResolveReportsController();
const userStatusController = new UserStatusController();

adminRouter.use(ensureAdminAuthenticated)

adminRouter.post(
  '/approve-host',
  celebrate({
    [Segments.BODY]: {
      user_id: Joi.number().integer().min(2).required()
    }
  }),
  decideHostRequestController.create
);

adminRouter.delete(
  '/deny-host',
  celebrate({
    [Segments.BODY]: {
      user_id: Joi.number().integer().min(2).required(),
      reason: Joi.string().required()
    }
  }),
  decideHostRequestController.delete
);

adminRouter.put(
  '/resolve-report/:report_id',
  resolveReportsController.update
);

adminRouter.put(
  '/user-status/',
  celebrate({
    [Segments.BODY]: {
      user_id: Joi.number().integer().min(2).required(),
      status: Joi.string().required().valid('ok', 'analyzing', 'blocked')
    }
  }),
  userStatusController.update
)

export default adminRouter;
