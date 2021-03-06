import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import multer from "multer";

import storageConfig from "@config/storage";

import ensureHostPrivilege from '../middlewares/ensureHostPrivilege';
import ensureAuthenticated from '@modules/users/infra/http/middleware/ensureAuthenticated';

import ExperiencesController from '@modules/experiences/infra/http/controllers/ExperiencesController';
import SearchForExperiencesController from '../controllers/SearchForExperiencesController';
import ExpPhotosController from "../controllers/ExpPhotosController";
import NearExperiencesController from '../controllers/NearExperiencesController';
import ExpCoverController from '../controllers/ExpCoverController';

import schedulesRouter from './schedules.routes';
import favoritesRouter from './favorites.routes';
import categoriesRouter from './categories.routes';
import HostExperiencesController from '../controllers/HostExperiencesController';
import UserExperiencesController from '../controllers/UserExperiencesController';

const experiencesRouter = Router();
const experiencesController = new ExperiencesController();
const searchForExperiencesController = new SearchForExperiencesController();
const expPhotosController = new ExpPhotosController();
const nearExperiencesController = new NearExperiencesController();
const expCoverController = new ExpCoverController();
const hostExperiencesController = new HostExperiencesController();
const userExperiencesController = new UserExperiencesController();

const upload = multer(storageConfig.multer);

experiencesRouter.post(
  '/',
  ensureHostPrivilege,
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      duration: Joi.number().required().max(360),
      description: Joi.string().required(),
      price: Joi.number().required(),
      requirements: Joi.string(),
      parental_rating: Joi.number().min(0).required(),
      max_guests: Joi.number().integer().required().min(1),
      address: Joi.string(),
      latitude: Joi.number(),
      longitude: Joi.number(),
      is_online: Joi.boolean(),
      category_id: Joi.number().integer().required().min(1)
    }
  }),
  experiencesController.create
);

experiencesRouter.get(
  '/:exp_id/show',
  ensureAuthenticated,
  experiencesController.show
)

experiencesRouter.put(
  '/',
  ensureHostPrivilege,
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      duration: Joi.number().required().max(360),
      description: Joi.string().required(),
      price: Joi.number().required(),
      requirements: Joi.string(),
      parental_rating: Joi.number().min(0).required(),
      max_guests: Joi.number().integer().required().min(1),
      address: Joi.string(),
      latitude: Joi.number(),
      longitude: Joi.number(),
      is_online: Joi.boolean(),
      hidden: Joi.boolean(),
      experience_id: Joi.number().integer().required(),
      category_id: Joi.number().integer().required().min(1)
    }
  }),
  experiencesController.update
)

experiencesRouter.get(
  '/',
  ensureAuthenticated,
  experiencesController.index
)

experiencesRouter.get(
  '/near',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      lat: Joi.number(),
      lon: Joi.number(),
    }
  }),
  nearExperiencesController.index
)

experiencesRouter.get(
  '/search',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().optional(),
      min_duration: Joi.number().integer().min(1).optional(),
      max_duration: Joi.number().integer().max(360).optional(),
      min_price: Joi.number().min(0).optional(),
      max_price: Joi.number().optional(),
      parental_rating: Joi.number().min(0).optional(),
      is_online: Joi.boolean().optional(),
      categories:
        Joi.array().items(
          Joi.number().integer().min(1)
        ).optional(),
    }
  }),
  searchForExperiencesController.index
);

experiencesRouter.post(
  '/:exp_id/photos',
  ensureHostPrivilege,
  upload.single('photo'),
  expPhotosController.create
);

experiencesRouter.put(
  '/:exp_id/photos/:photo_id',
  ensureHostPrivilege,
  upload.single('photo'),
  expPhotosController.update
);

experiencesRouter.delete(
  '/:exp_id/photos/:photo_id',
  ensureHostPrivilege,
  expPhotosController.delete
);

experiencesRouter.patch(
  '/:exp_id/cover',
  ensureHostPrivilege,
  upload.single('cover'),
  expCoverController.update
);

experiencesRouter.delete(
  '/:exp_id',
  ensureHostPrivilege,
  experiencesController.delete
);

experiencesRouter.get(
  '/host/:host_id',
  ensureAuthenticated,
  hostExperiencesController.index
);

experiencesRouter.get(
  '/user/:user_id',
  ensureAuthenticated,
  userExperiencesController.index
);

experiencesRouter.use('/schedules', schedulesRouter)
experiencesRouter.use('/favorites', favoritesRouter)
experiencesRouter.use('/categories', categoriesRouter)

export default experiencesRouter;
