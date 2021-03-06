import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ApproveHostRequestService from '@modules/admin/services/ApproveHostRequestService';
import DenyHostRequestService from '@modules/admin/services/DenyHostRequestService';
import ListAllHostRequestsService from '@modules/admin/services/ListAllHostRequestsService';

export default class ManageHostRequestsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { user_id } = request.body;

    const approveHostRequest = container.resolve(ApproveHostRequestService);

    const host = await approveHostRequest.execute(user_id);

    return response.json(host);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { user_id, reason } = request.body;

    const denyHostRequest = container.resolve(DenyHostRequestService)

    await denyHostRequest.execute({
      user_id,
      reason
    });

    return response.status(204).json({});
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const listAllHostRequests = container.resolve(ListAllHostRequestsService);

    const hostRequests = await listAllHostRequests.execute(userId);

    return response.json(hostRequests);
  }
}
