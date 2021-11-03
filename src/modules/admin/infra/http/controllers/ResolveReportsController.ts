import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ResolveReportService from '@modules/admin/services/ResolveReportService';
import ShowReportService from '@modules/reviews/services/ShowReportService';

export default class ResolveReportsController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { report_id } = request.params;

    const resolveReport = container.resolve(ResolveReportService);

    const resolvedReport = await resolveReport.execute(Number(report_id));

    return response.json(classToClass(resolvedReport));
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const { report_id } = request.params;

    const showReport = container.resolve(ShowReportService);

    const report = await showReport.execute({
      report_id: Number(report_id),
      user_id: userId
    });

    return response.json(classToClass(report));
  }
}
