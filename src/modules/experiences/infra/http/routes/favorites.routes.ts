import { Router } from "express";
import { celebrate, Segments, Joi } from "celebrate";

import FavoritesController from "../controllers/FavoritesController";

import ensureAuthenticated from "@modules/users/infra/http/middleware/ensureAuthenticated";

const favoritesRouter = Router();
const favoritesController = new FavoritesController();

favoritesRouter.post(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      exp_id: Joi.number().min(1).required(),
      folder: Joi.string().optional()
    }
  }),
  favoritesController.create
);

favoritesRouter.delete(
  '/:exp_id',
  ensureAuthenticated,
  favoritesController.delete
);

favoritesRouter.put(
  '/:exp_id',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      folder: Joi.string().optional()
    }
  }),
  favoritesController.update
);

favoritesRouter.get(
  '/',
  ensureAuthenticated,
  favoritesController.index
)

export default favoritesRouter;
