import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateUserStatusService from '@modules/admin/services/UpdateUserStatusService';
import ManageBlockedUserService from '@modules/admin/services/ManageBlockedUserService';
import ListAllReportedHostsService from '@modules/admin/services/ListAllReportedHostsService';

export default class ReportedHostsController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { user_id, status } = request.body;

    const updateUserStatus = container.resolve(UpdateUserStatusService);
    const manageBlockedUser = container.resolve(ManageBlockedUserService);

    const user = await updateUserStatus.execute({
      user_id,
      status
    });

    await manageBlockedUser.execute(user.id);

    return response.json(classToClass(user));
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const listAllReportedHosts = container.resolve(ListAllReportedHostsService);

    const reportedHosts = await listAllReportedHosts.execute(userId);

    return response.json(classToClass(reportedHosts));
  }
}
