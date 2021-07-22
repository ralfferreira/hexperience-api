import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';
import path from 'path';

import AppError from '@shared/errors/AppError';

import ICreateUserDTO from "../dtos/ICreateUserDTO";
import IUsersRepository from '../repositories/IUsersRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

@injectable()
class SendAccountConfirmationMailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider
  ) {}

  public async execute(data: ICreateUserDTO): Promise<void> {
    const checkUserExists = await this.usersRepository.findByEmail(data.email);

    if (checkUserExists) {
      throw new AppError('Email is already been used!');
    }

    const token = sign(data, 'Secret', {
      subject: `${data.email}`,
      expiresIn: '2h'
    });

    const accountConfirmationTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'account-confirmation.hbs'
    );

    await this.mailProvider.sendMail({
      to: {
        name: data.name,
        email: data.email
      },
      subject: '[Hexperience] Confirmação de Cadastro da Conta',
      templateData: {
        file: accountConfirmationTemplate,
        variables: {
          name: data.name,
          link: `http://localhost:3000/account-confirmation?token=${token}`
        }
      }
    });
  }
}

export default SendAccountConfirmationMailService;
