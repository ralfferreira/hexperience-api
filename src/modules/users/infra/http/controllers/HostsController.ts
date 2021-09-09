import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateHostService from '@modules/users/services/UpdateHostService';
import ListAllAvailableHostsService from '@modules/users/services/ListAllAvailableHostsService';

export default class HostsController {
  public async update(request: Request, response: Response): Promise<Response> {
    const hostId = request.user.hostId;
    const { nickname } = request.body;

    const updateHost = container.resolve(UpdateHostService);

    const host = await updateHost.execute({ nickname, host_id: hostId });

    return response.json(host);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const { nickname } = request.body;

    const listAllAvailableHosts = container.resolve(ListAllAvailableHostsService);

    const hosts = await listAllAvailableHosts.execute({
      user_id: userId,
      nickname,
    });

    return response.json(hosts);
  }
}
