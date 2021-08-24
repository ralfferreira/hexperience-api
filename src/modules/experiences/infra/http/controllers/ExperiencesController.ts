import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateExperienceService from '@modules/experiences/services/CreateExperienceService';
import ShowExperienceService from '@modules/experiences/services/ShowExperienceService';

export default class ExperiencesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const host_id = request.user.hostId;
    const {
      name,
      duration,
      address,
      description,
      latitude,
      longitude,
      parental_rating,
      price,
      requirements,
      is_online
    } = request.body;

    const createExperience = container.resolve(CreateExperienceService);

    const experience = await createExperience.execute({
      address,
      description,
      duration,
      host_id,
      is_online,
      latitude,
      longitude,
      name,
      parental_rating,
      price,
      requirements
    });

    return response.json(experience);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { exp_id } = request.params;

    const showExperience = container.resolve(ShowExperienceService);

    const experience = await showExperience.execute(Number(exp_id));

    return response.json(experience);
  }
}
