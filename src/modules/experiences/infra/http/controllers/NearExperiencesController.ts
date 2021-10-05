import { Request, Response } from "express";
import { container } from "tsyringe";

import ListNearExperiencesService from "@modules/experiences/services/ListNearExperiencesService";

export default class NearExperiencesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const { lat, lon } = request.body;

    const listNearExperiences = container.resolve(ListNearExperiencesService);

    const result = await listNearExperiences.execute({
      user_id: userId,
      currentLocation: { lat, lon }
    });

    return response.json(result);
  }
}
