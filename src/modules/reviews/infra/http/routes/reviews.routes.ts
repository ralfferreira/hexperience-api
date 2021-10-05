import { Router } from "express";
import { celebrate, Segments, Joi } from "celebrate";

import ensureAuthenticated from "@modules/users/infra/http/middleware/ensureAuthenticated";

import ReviewsController from "../controllers/ReviewsController";
import HostReviewsController from "../controllers/HostReviewsController";

const reviewsRouter = Router();
const reviewsController = new ReviewsController();
const hostReviewsController = new HostReviewsController();

reviewsRouter.use(ensureAuthenticated);

reviewsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      comment: Joi.string().required(),
      rating: Joi.number().integer().min(1).required(),
      exp_id: Joi.number().integer().required()
    }
  }),
  reviewsController.create
);

reviewsRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      comment: Joi.string().required(),
      rating: Joi.number().integer().min(1).required(),
      review_id: Joi.number().integer().required()
    }
  }),
  reviewsController.update
);

reviewsRouter.get(
  '/hosts/:host_id',
  hostReviewsController.index
);

export default reviewsRouter;
