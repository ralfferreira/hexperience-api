import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import HostRequestController from '../controllers/HostRequestController';

import ensureAuthenticated from '../middleware/ensureAuthenticated';

const hostRouter = Router();
const hostRequestController = new HostRequestController();

hostRouter.post(
  '/request-privilege',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      cpf: Joi.string().min(11).max(14),
      cnpj: Joi.string().min(14),
      nickname: Joi.string().required(),
    }
  }),  
  hostRequestController.create
)

export default hostRouter;
