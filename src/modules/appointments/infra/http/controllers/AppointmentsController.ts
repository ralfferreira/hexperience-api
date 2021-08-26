import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import ShowAppointmentService from '@modules/appointments/services/ShowAppointmentService';

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const { guests, paid, schedule_id } = request.body;

    const createAppointment = container.resolve(CreateAppointmentService);

    const appointment = await createAppointment.execute({
      guests,
      paid,
      schedule_id,
      user_id: userId
    });

    return response.json(appointment);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const hostId = request.user.hostId;

    const { appointment_id } = request.params;

    const showAppointment = container.resolve(ShowAppointmentService);

    const appointment = await showAppointment.execute({
      user_id: userId,
      host_id: hostId,
      appointment_id: Number(appointment_id)
    });

    return response.json(appointment);
  }
}
