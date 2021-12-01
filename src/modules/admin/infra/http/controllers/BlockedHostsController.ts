import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';
import { container } from 'tsyringe';

import ListAllNotOkHostsService from '@modules/admin/services/ListAllNotOkHostsService';

export default class BlockedHostsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id

    const listAllNotOkHosts = container.resolve(ListAllNotOkHostsService);

    const notOkHosts = await listAllNotOkHosts.execute(userId);

    return response.json(classToClass(notOkHosts))
  }
}
