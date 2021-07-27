import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreateUserService from '@modules/users/services/CreateUserService';
import SendAccountVerificationMailService from '@modules/users/services/SendAccountVerificationMailService';
import AccountVerificationService from '@modules/users/services/AccountVerificationService';

export default class UsersController {
  public async signUp(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({ name, email, password });

    return response.json(classToClass(user));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const sendAccountVerificationMail = container.resolve(SendAccountVerificationMailService);

    await sendAccountVerificationMail.execute({ name, email, password });

    return response.status(204).json({});    
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { token } = request.body;

    const accountVerification = container.resolve(AccountVerificationService);

    const user = await accountVerification.execute(token);

    return response.json(classToClass(user));
  }
}
