import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middleware/ensureAuthenticated';

import AppointmentsController from '../controllers/AppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      guests: Joi.number().positive().required(),
      paid: Joi.boolean().required().default(false),
      schedule_id: Joi.number().integer().required()
    }
  }),
  appointmentsController.create
);

appointmentsRouter.get(
  '/:appointment_id',
  appointmentsController.show
);

appointmentsRouter.get(
  '/user/:user_id',
  appointmentsController.index
);

appointmentsRouter.delete(
  '/',
  celebrate({
    [Segments.BODY]: {
      appointment_id: Joi.number().integer().required()
    }
  }),
  appointmentsController.delete
);

export default appointmentsRouter;
