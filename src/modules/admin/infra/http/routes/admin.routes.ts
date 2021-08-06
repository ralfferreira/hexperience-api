import { Router } from "express";
import { celebrate, Segments, Joi } from "celebrate";

import ApproveHostRequestController from "../controllers/ApproveHostRequestController";
import ensureAdminAuthenticated from "../middlewares/ensureAdminAuthenticated";

const adminRouter = Router();
const approveHostRequestController = new ApproveHostRequestController();

adminRouter.post(
  '/approve-host',
  ensureAdminAuthenticated,
  celebrate({
    [Segments.BODY]: {
      user_id: Joi.number().integer().min(2).required()
    }
  }),
  approveHostRequestController.create
);

export default adminRouter;
