import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ReportExperienceService from '@modules/reviews/services/ReportExperienceService';
import ManageExperienceReportsService from '@modules/reviews/services/ManageExperienceReportsService';
import ManageHostReportsService from '@modules/reviews/services/ManageHostReportsService';

export default class ExperienceReportsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const { comment, reason, exp_id } = request.body;

    const reportExperience = container.resolve(ReportExperienceService);

    const manageExperienceReports = container.resolve(ManageExperienceReportsService);
    const manageHostReports = container.resolve(ManageHostReportsService);

    const report = await reportExperience.execute({
      comment,
      reason,
      exp_id,
      user_id: userId
    });

    await manageExperienceReports.execute(exp_id);

    await manageHostReports.execute(report.host.id);

    return response.json(report);
  }
}
