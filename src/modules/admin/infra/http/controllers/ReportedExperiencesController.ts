import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ListAllReportedExperiencesService from '@modules/admin/services/ListAllReportedExperiencesService';
import BlockExperienceService from '@modules/admin/services/BlockExperienceService';

export default class ReportedExperiencesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const listAllReportedExperience = container.resolve(ListAllReportedExperiencesService);

    const reportedExperiences = await listAllReportedExperience.execute(userId);

    return response.json(classToClass(reportedExperiences));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { exp_id } = request.body;

    const blockExperience = container.resolve(BlockExperienceService);

    const blockedExperience = await blockExperience.execute(exp_id);

    return response.json(classToClass(blockedExperience));
  }
}
