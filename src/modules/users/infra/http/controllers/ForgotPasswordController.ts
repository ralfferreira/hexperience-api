import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SendForgotPasswordMailService from '@modules/users/services/SendForgotPasswordMailService';
import ResetPasswordService from '@modules/users/services/ResetPasswordService';

export default class ForgotPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const sendForgotPasswordMail = container.resolve(SendForgotPasswordMailService);

    await sendForgotPasswordMail.execute({ email });

    return response.status(204).json({});
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { token, password } = request.body;

    const resetPassword = container.resolve(ResetPasswordService);

    await resetPassword.execute({
      token,
      password
    });

    return response.status(204).json({});
  }
}