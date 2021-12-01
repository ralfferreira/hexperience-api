import { Router } from "express";
import { celebrate, Segments, Joi } from "celebrate";

import AdminConfigureController from "../controllers/AdminConfigureController";

import ensureAdminAuthenticated from "../middlewares/ensureAdminAuthenticated";

import hostRequestsRouter from "./hostRequests.routes";
import reportedHostsRouter from "./reportedHosts.routes";
import reportedExperiencesRouter from "./reportedExperiences.routes";
import reportedBugsRouter from "./reportedBugs.routes";
import manageReportsRouter from "./manageReports.routes";
import blockedRouter from "./blocked.routes";

const adminRouter = Router();
const adminConfigureController = new AdminConfigureController();

adminRouter.use(ensureAdminAuthenticated);

adminRouter.get(
  '/configure',
  adminConfigureController.show
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
adminRouter.use('/reports', manageReportsRouter);
adminRouter.use('/reported/hosts', reportedHostsRouter);
adminRouter.use('/reported/experiences', reportedExperiencesRouter);
adminRouter.use('/blocked', blockedRouter);
adminRouter.use('/bugs', reportedBugsRouter);

export default adminRouter;
