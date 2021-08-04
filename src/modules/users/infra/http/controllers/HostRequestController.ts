import { Request, Response } from 'express';
import { container } from 'tsyringe';

import RequestHostPrivilegeService from '@modules/users/services/RequestHostPrivilegeService';

export default class HostRequestController {
  public async create(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const { cpf, cnpj, nickname } = request.body;

    const requestHostPrivilege = container.resolve(RequestHostPrivilegeService);

    const hostRequest = await requestHostPrivilege.execute({
      cpf,
      cnpj,
      nickname,
      user_id: userId
    });

    return response.json(hostRequest);
  }
}