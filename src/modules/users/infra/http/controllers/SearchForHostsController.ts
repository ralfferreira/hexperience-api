import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SearchForHostsService from '@modules/users/services/SearchForHostsService';

export default class SearchForHostsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const { nickname } = request.body;

    const searchForHosts = container.resolve(SearchForHostsService);

    const hosts = await searchForHosts.execute({
      user_id: userId,
      nickname
    });

    return response.json(hosts);
  }
}
