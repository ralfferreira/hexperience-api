import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '../middleware/ensureAuthenticated';

import HostsController from '../controllers/HostsController';
import HostRequestController from '../controllers/HostRequestController';

const hostRouter = Router();
const hostRequestController = new HostRequestController();
const hostsController = new HostsController();

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
);

hostRouter.put(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      nickname: Joi.string().required()
    }
  }),
  hostsController.update
)

hostRouter.get(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      nickname: Joi.string().optional()
    }
  }),
  hostsController.index
)

export default hostRouter;
