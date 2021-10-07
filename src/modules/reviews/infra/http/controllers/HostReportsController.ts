import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ReportHostService from '@modules/reviews/services/ReportHostService';
import ManageHostReportsService from '@modules/reviews/services/ManageHostReportsService';

export default class HostReportsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const { comment, reason, host_id } = request.body;

    const reportHost = container.resolve(ReportHostService);
    const manageHostReports = container.resolve(ManageHostReportsService);

    const report = await reportHost.execute({
      comment,
      reason,
      host_id,
      user_id: userId
    });

    await manageHostReports.execute(host_id);

    return response.json(report);
  }
}
