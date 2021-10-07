import { Request, Response } from "express";
import { container } from "tsyringe";

import UpdateExperienceCoverService from "@modules/experiences/services/UpdateExperienceCoverService";

export default class ExpCoverController {
  public async update(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const { exp_id } = request.params;
    const photo = request.file.filename;

    const updateExperienceCover = container.resolve(UpdateExperienceCoverService);

    const experience = await updateExperienceCover.execute({
      photo,
      experience_id: Number(exp_id),
      user_id: userId
    })

    return response.json(experience);
  }
}
