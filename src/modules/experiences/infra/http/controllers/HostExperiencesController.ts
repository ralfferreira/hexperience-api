import { Request, Response } from "express";
import { container } from "tsyringe";
import { classToClass } from "class-transformer";

import ListHostExperiencesService from "@modules/experiences/services/ListHostExperiencesService";

export default class HostExperiencesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { host_id } = request.params;

    const listHostExperiences = container.resolve(ListHostExperiencesService);

    const experiences = await listHostExperiences.execute(Number(host_id));

    return response.json(classToClass(experiences));
  }
}
