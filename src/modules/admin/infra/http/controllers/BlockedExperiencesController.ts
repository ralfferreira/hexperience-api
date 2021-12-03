import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';
import { container } from 'tsyringe';

import ListAllBlockedExperiencesService from '@modules/admin/services/ListAllBlockedExperiencesService';
import UnblockExperienceService from '@modules/admin/services/UnblockExperienceService';

export default class BlockedExperiencesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id

    const listAllBlockedExperiences = container.resolve(ListAllBlockedExperiencesService);

    const blockedExperiences = await listAllBlockedExperiences.execute(userId);

    return response.json(classToClass(blockedExperiences))
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { exp_id } = request.body;

    const unblockExperience = container.resolve(UnblockExperienceService);

    const experience = await unblockExperience.execute(exp_id);

    return response.json(classToClass(experience));
  }
}
