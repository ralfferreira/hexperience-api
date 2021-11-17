import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middleware/ensureAuthenticated';

import AppointmentsController from '../controllers/AppointmentsController';
import HostAppointmentsController from '../controllers/HostAppointmentsController';
import ExperienceAppointmentsController from '../controllers/ExperienceAppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();
const hostAppointmentsController = new HostAppointmentsController();
const experiencesAppointmentsController = new ExperienceAppointmentsController();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      guests: Joi.number().positive().required(),
      status: Joi.string().required(),
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
  '/users/:user_id',
  appointmentsController.index
);

appointmentsRouter.get(
  '/hosts/:host_id',
  hostAppointmentsController.index
);

appointmentsRouter.get(
  '/experiences/:exp_id',
  experiencesAppointmentsController.index
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
