import { Router } from "express";
import { celebrate, Segments, Joi } from "celebrate";

import ReportedHostsController from "../controllers/ReportedHostsController";

const reportedHostsRouter = Router();
const reportedHostsController = new ReportedHostsController();

reportedHostsRouter.get(
  '/',
  reportedHostsController.index
)

reportedHostsRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      user_id: Joi.number().integer().min(2).required(),
      status: Joi.string().required().valid('ok', 'analyzing', 'blocked')
    }
  }),
  reportedHostsController.update
);

export default reportedHostsRouter;
