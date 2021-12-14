import { Request, Response } from "express";
import { container } from "tsyringe";
import { classToClass } from "class-transformer";

import ListExperienceAppointmentsService from "@modules/appointments/services/ListExperienceAppointmentsService";

export default class ExperienceAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { exp_id } = request.params;

    const listExperienceAppointments = container.resolve(ListExperienceAppointmentsService);

    const appointments = await listExperienceAppointments.execute(Number(exp_id));

    return response.json(classToClass(appointments));
  }
}
