import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middleware/ensureAuthenticated';

import AppointmentsController from '../controllers/AppointmentsController';
import HostAppointmentsController from '../controllers/HostAppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();
const hostAppointmentsController = new HostAppointmentsController();

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

appointmentsRouter.get(
  '/host/:host_id',
  hostAppointmentsController.index
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
