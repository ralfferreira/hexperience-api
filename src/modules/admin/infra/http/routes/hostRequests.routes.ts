import { Router } from "express";
import { celebrate, Segments, Joi } from "celebrate";

import ManageHostRequestsController from "../controllers/ManageHostRequestController";

const hostRequestsRouter = Router();
const manageHostRequestController = new ManageHostRequestsController();

hostRequestsRouter.get(
  '/',
  manageHostRequestController.index
)

hostRequestsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      user_id: Joi.number().integer().min(2).required()
    }
  }),
  manageHostRequestController.create
);

hostRequestsRouter.delete(
  '/',
  celebrate({
    [Segments.BODY]: {
      user_id: Joi.number().integer().min(2).required(),
      reason: Joi.string().required()
    }
  }),
  manageHostRequestController.delete
);

export default hostRequestsRouter;
