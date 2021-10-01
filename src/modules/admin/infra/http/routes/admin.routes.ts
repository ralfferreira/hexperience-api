import { Router } from "express";
import { celebrate, Segments, Joi } from "celebrate";

import DecideHostRequestController from "../controllers/DecideHostRequestController";
import ResolveReportsController from "../controllers/ResolveReportsController";
import ReportedHostsController from "../controllers/ReportedHostsController";
import BlockedExperiencesController from "../controllers/BlockedExperiencesController";
import AdminConfigureController from "../controllers/AdminConfigureController";

import ensureAdminAuthenticated from "../middlewares/ensureAdminAuthenticated";

const adminRouter = Router();
const decideHostRequestController = new DecideHostRequestController();
const resolveReportsController = new ResolveReportsController();
const reportedHostsController = new ReportedHostsController();
const blockedExperiencesController = new BlockedExperiencesController();
const adminConfigureController = new AdminConfigureController();

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
  '/reports/:report_id',
  resolveReportsController.update
);

adminRouter.get(
  '/reports/hosts',
  reportedHostsController.index
)

adminRouter.put(
  '/reports/hosts',
  celebrate({
    [Segments.BODY]: {
      user_id: Joi.number().integer().min(2).required(),
      status: Joi.string().required().valid('ok', 'analyzing', 'blocked')
    }
  }),
  reportedHostsController.update
);

adminRouter.put(
  '/blocked-experiences/',
  celebrate({
    [Segments.BODY]: {
      exp_id: Joi.number().integer().min(1).required(),
    }
  }),
  blockedExperiencesController.update
);

adminRouter.put(
  '/configure',
  celebrate({
    [Segments.BODY]: {
      days_blocked: Joi.number().integer().min(1).required(),
      reports_to_block: Joi.number().integer().min(1).required()
    }
  }),
  adminConfigureController.update
);

export default adminRouter;
