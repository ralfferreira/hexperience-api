import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ExperiencesController from '@modules/experiences/infra/http/controllers/ExperiencesController';

import ensureHostPrivilige from '../middlewares/ensureHostPrivilige';

const experienceRouter = Router();
const experiencesController = new ExperiencesController();

experienceRouter.post(
  '/',
  ensureHostPrivilige,
  celebrate({
    [Segments.BODY]: {
    }
  }),  
  experiencesController.create
)

export default experienceRouter;