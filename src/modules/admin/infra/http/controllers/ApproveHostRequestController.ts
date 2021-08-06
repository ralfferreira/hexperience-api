import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ApproveHostRequestService from '@modules/admin/services/ApproveHostRequestService';

export default class ApproveHostRequestController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { user_id } = request.body;

    const approveHostRequest = container.resolve(ApproveHostRequestService);

    const host = await approveHostRequest.execute(user_id);

    return response.json(host);
  }
}
