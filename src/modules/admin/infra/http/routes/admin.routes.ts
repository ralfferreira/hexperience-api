import { Router } from "express";
import { celebrate, Segments, Joi } from "celebrate";

import DecideHostRequestController from "../controllers/DecideHostRequestController";
import ensureAdminAuthenticated from "../middlewares/ensureAdminAuthenticated";
import ReportsController from "@modules/reviews/infra/http/controllers/ReportsController";

const adminRouter = Router();
const decideHostRequestController = new DecideHostRequestController();
const reportsController = new ReportsController();

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
  reportsController.update
)

export default adminRouter;
