import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ReportExperienceService from '@modules/reviews/services/ReportExperienceService';
import ResolveReportService from '@modules/admin/services/ResolveReportService';

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

  public async update(request: Request, response: Response): Promise<Response> {
    const { report_id } = request.params;

    const resolveReport = container.resolve(ResolveReportService);

    const resolvedReport = await resolveReport.execute(Number(report_id));

    return response.json(resolvedReport);
  }
}