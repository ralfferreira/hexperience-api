import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import ShowAppointmentService from '@modules/appointments/services/ShowAppointmentService';
import ListUserAppointmentsService from '@modules/appointments/services/ListUserAppointmentsService';
import CancelAppointmentService from '@modules/appointments/services/CancelAppointmentService';

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

    return response.json(classToClass(appointment));
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { user_id } = request.params;
    const userId = request.user.id;

    const listUserAppointments = container.resolve(ListUserAppointmentsService);

    const appointments = await listUserAppointments.execute(Number(userId));

    return response.json(appointments);
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

    return response.json(classToClass(appointment));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const { appointment_id } = request.body;

    const cancelAppointment = container.resolve(CancelAppointmentService);

    await cancelAppointment.execute({
      user_id: userId,
      appointment_id
    });

    return response.status(204).json({});
  }
}
