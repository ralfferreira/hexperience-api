import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UnblockExperienceService from '@modules/admin/services/UnblockExperienceService';
import ListAllReportedExperiencesService from '@modules/admin/services/ListAllReportedExperiencesService';

export default class ReportedExperiencesController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { exp_id } = request.body;

    const unblockExperience = container.resolve(UnblockExperienceService);

    const experience = await unblockExperience.execute(exp_id);

    return response.json(experience);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const listAllReportedExperience = container.resolve(ListAllReportedExperiencesService);

    const reportedExperiences = await listAllReportedExperience.execute(userId);

    return response.json(reportedExperiences);
  }
}
