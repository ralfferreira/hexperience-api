import { Request, Response } from "express";
import { container } from "tsyringe";

import ListOnlyHostAppointmentsService from "@modules/appointments/services/ListOnlyHostAppointmentsService";

export default class HostAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { host_id } = request.params;

    const listOnlyHostAppointments = container.resolve(ListOnlyHostAppointmentsService);

    const appointments = await listOnlyHostAppointments.execute(Number(host_id));

    return response.json(appointments);
  }
}
