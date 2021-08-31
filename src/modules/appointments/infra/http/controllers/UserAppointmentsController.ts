import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListUserAppointmentsService from '@modules/appointments/services/ListUserAppointmentsService';

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
}
