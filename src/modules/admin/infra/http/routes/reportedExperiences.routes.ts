import { Router } from "express";
import { celebrate, Segments, Joi } from "celebrate";

import ReportedExperiencesController from "../controllers/ReportedExperiencesController";

const reportedExperiencesRouter = Router();
const reportedExperiencesController = new ReportedExperiencesController();

reportedExperiencesRouter.get(
  '/',
  reportedExperiencesController.index
)

reportedExperiencesRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      exp_id: Joi.number().integer().min(1).required(),
    }
  }),
  reportedExperiencesController.update
);

export default reportedExperiencesRouter;
