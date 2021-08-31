import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListUserAppointmentsService from '@modules/appointments/services/ListUserAppointmentsService';
import CancelAppointmentService from '@modules/appointments/services/CancelAppointmentService';

export default class UserAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { user_id } = request.params;
    // const userId = request.user.id;

    const listUserAppointments = container.resolve(ListUserAppointmentsService);

    const appointments = await listUserAppointments.execute({
      id: Number(user_id)
    });

    return response.json(appointments);
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
