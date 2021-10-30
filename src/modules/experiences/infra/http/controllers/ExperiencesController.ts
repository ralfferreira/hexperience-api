import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreateExperienceService from '@modules/experiences/services/CreateExperienceService';
import ShowExperienceService from '@modules/experiences/services/ShowExperienceService';
import UpdateExperienceService from '@modules/experiences/services/UpdateExperienceService';
import ListAllAvailableExperiencesService from '@modules/experiences/services/ListAllAvailableExperiencesService';

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
      is_online,
      max_guests,
      category_id
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
      requirements,
      max_guests,
      category_id
    });

    return response.json(experience);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { exp_id } = request.params;

    const showExperience = container.resolve(ShowExperienceService);

    const experience = await showExperience.execute(Number(exp_id));

    return response.json(classToClass(experience));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const hostId = request.user.hostId;

    const {
      address,
      description,
      duration,
      is_online,
      latitude,
      longitude,
      name,
      parental_rating,
      price,
      requirements,
      experience_id,
      max_guests,
      hidden
    } = request.body

    const updateExperience = container.resolve(UpdateExperienceService);

    const experience = await updateExperience.execute({
      host_id: hostId,
      id: experience_id,
      address,
      description,
      duration,
      is_online,
      latitude,
      longitude,
      name,
      parental_rating,
      price,
      requirements,
      max_guests,
      hidden
    });

    return response.json(experience);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const listAllAvailableExperiences = container.resolve(ListAllAvailableExperiencesService);

    const result = await listAllAvailableExperiences.execute({
      user_id: userId
    });

    return response.json(result);
  }
}
