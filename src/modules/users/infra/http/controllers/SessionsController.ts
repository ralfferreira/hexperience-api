import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import RenewSessionService from '@modules/users/services/RenewSessionService';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateUser = container.resolve(AuthenticateUserService);

    const { user, token } = await authenticateUser.execute({ email, password });

    return response.json({ user: classToClass(user), token: token });
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { token, user_id } = request.body;

    const renewSession = container.resolve(RenewSessionService);

    const { user, newToken } = await renewSession.execute({
      token,
      user_id
    });

    return response.json({ user: classToClass(user), newToken });
  }
}
