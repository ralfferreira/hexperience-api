import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UnblockExperienceService from '@modules/admin/services/UnblockExperienceService';

export default class BlockedExperiencesController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { exp_id } = request.body;

    const unblockExperience = container.resolve(UnblockExperienceService);

    const experience = await unblockExperience.execute(exp_id);

    return response.json(experience);
  }
}
