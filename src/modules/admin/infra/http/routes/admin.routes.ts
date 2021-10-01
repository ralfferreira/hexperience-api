import { Router } from "express";
import { celebrate, Segments, Joi } from "celebrate";

import ManageHostRequestController from "../controllers/ManageHostRequestController";
import ResolveReportsController from "../controllers/ResolveReportsController";
import ReportedHostsController from "../controllers/ReportedHostsController";
import ReportedExperiencesController from "../controllers/ReportedExperiencesController";
import AdminConfigureController from "../controllers/AdminConfigureController";

import ensureAdminAuthenticated from "../middlewares/ensureAdminAuthenticated";

const adminRouter = Router();
const manageHostRequestController = new ManageHostRequestController();
const resolveReportsController = new ResolveReportsController();
const reportedHostsController = new ReportedHostsController();
const reportedExperiencesController = new ReportedExperiencesController();
const adminConfigureController = new AdminConfigureController();

adminRouter.use(ensureAdminAuthenticated)

adminRouter.get(
  '/host-requests',
  manageHostRequestController.index
)

adminRouter.post(
  '/host-requests',
  celebrate({
    [Segments.BODY]: {
      user_id: Joi.number().integer().min(2).required()
    }
  }),
  manageHostRequestController.create
);

adminRouter.delete(
  '/host-requests',
  celebrate({
    [Segments.BODY]: {
      user_id: Joi.number().integer().min(2).required(),
      reason: Joi.string().required()
    }
  }),
  manageHostRequestController.delete
);

adminRouter.get(
  '/reports/:report_id',
  resolveReportsController.show
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

adminRouter.get(
  '/reports/experiences',
  reportedExperiencesController.index
)

adminRouter.put(
  '/reports/experiences',
  celebrate({
    [Segments.BODY]: {
      exp_id: Joi.number().integer().min(1).required(),
    }
  }),
  reportedExperiencesController.update
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
