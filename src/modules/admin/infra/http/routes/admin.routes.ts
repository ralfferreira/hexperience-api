import { Router } from "express";
import { celebrate, Segments, Joi } from "celebrate";

import ResolveReportsController from "../controllers/ResolveReportsController";
import AdminConfigureController from "../controllers/AdminConfigureController";

import ensureAdminAuthenticated from "../middlewares/ensureAdminAuthenticated";

import hostRequestsRouter from "./hostRequests.routes";
import reportedHostsRouter from "./reportedHosts.routes";
import reportedExperiencesRouter from "./reportedExperiences.routes";
import reportedBugsRouter from "./reportedBugs.routes";

const adminRouter = Router();
const resolveReportsController = new ResolveReportsController();
const adminConfigureController = new AdminConfigureController();

adminRouter.use(ensureAdminAuthenticated);

adminRouter.get(
  '/reports/:report_id',
  resolveReportsController.show
);

adminRouter.put(
  '/reports/:report_id',
  resolveReportsController.update
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

adminRouter.use('/host-requests', hostRequestsRouter);
adminRouter.use('/reports/hosts', reportedHostsRouter);
adminRouter.use('/reports/experiences', reportedExperiencesRouter);
adminRouter.use('/bugs', reportedBugsRouter);

export default adminRouter;
