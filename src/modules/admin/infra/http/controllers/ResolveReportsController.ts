import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ResolveReportService from '@modules/admin/services/ResolveReportService';

export default class ResolveReportsController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { report_id } = request.params;

    const resolveReport = container.resolve(ResolveReportService);

    const resolvedReport = await resolveReport.execute(Number(report_id));

    return response.json(resolvedReport);
  }
}
