import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreateUserService from '@modules/users/services/CreateUserService';
import SendAccountConfirmationMailService from '@modules/users/services/SendAccountConfirmationMailService';

export default class UsersController {
  public async signUp(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const sendAccountConfirmationMail = container.resolve(SendAccountConfirmationMailService);

    await sendAccountConfirmationMail.execute({ name, email, password });

    return response.status(204).json({})
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({ name, email, password });

    return response.json(classToClass(user));
  }
}
