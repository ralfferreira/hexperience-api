import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateUserStatusService from '@modules/admin/services/UpdateUserStatusService';
import ManageBlockedUserService from '@modules/admin/services/ManageBlockedUserService';

export default class UserStatusController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { user_id, status } = request.body;

    const updateUserStatus = container.resolve(UpdateUserStatusService);
    const manageBlockedUser = container.resolve(ManageBlockedUserService);

    const user = await updateUserStatus.execute({
      user_id,
      status
    });

    await manageBlockedUser.execute(user.id);

    return response.json(user);
  }
}
