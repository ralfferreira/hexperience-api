import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ReportExperienceService from '@modules/reviews/services/ReportExperienceService';

export default class ReportsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const { comment, reason, exp_id } = request.body;

    const reportExperience = container.resolve(ReportExperienceService);

    const report = await reportExperience.execute({
      comment,
      reason,
      exp_id,
      user_id: userId
    });

    return response.json(report);
  }
}
