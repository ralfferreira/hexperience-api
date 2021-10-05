import { Router } from "express";
import { celebrate, Segments, Joi } from "celebrate";

import ensureAuthenticated from "@modules/users/infra/http/middleware/ensureAuthenticated";

import ReviewsController from "../controllers/ReviewsController";
import HostReviewsController from "../controllers/HostReviewsController";
import ExperiencesReviewsController from "../controllers/ExperiencesReviewsController";

const reviewsRouter = Router();
const reviewsController = new ReviewsController();
const hostReviewsController = new HostReviewsController();
const experiencesReviewsController = new ExperiencesReviewsController();

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

reviewsRouter.get(
  '/experiences/:exp_id',
  experiencesReviewsController.index
);

export default reviewsRouter;
