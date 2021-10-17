import { inject, injectable } from 'tsyringe';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

import AppError from '@shared/errors/AppError';

import ICreateUserDTO from "../dtos/ICreateUserDTO";
import IUsersRepository from '../repositories/IUsersRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IAccountVerificationsRepository from '../repositories/IAccountVerificationsRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

@injectable()
class SendAccountVerificationMailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('AccountVerificationsRepository')
    private accountVerificationsRepository: IAccountVerificationsRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('MailProvider')
    private mailProvider: IMailProvider
  ) {}

  public async execute(data: ICreateUserDTO): Promise<void> {
    const checkUserExists = await this.usersRepository.findByEmail(data.email);

    if (checkUserExists) {
      throw new AppError('Email is already been used!');
    }

    const checkAccounts = await this.accountVerificationsRepository.findByEmail(data.email);

    if (checkAccounts) {
      throw new AppError('Email is already been used!');
    }

    const hashedPassword = await this.hashProvider.generateHash(data.password)

    const token = uuidv4();

    const accountVerification = await this.accountVerificationsRepository.create({
      email: data.email,
      name: data.name,
      password: hashedPassword,
      token
    });

    const accountConfirmationTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'account_confirmation.hbs'
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
          token: accountVerification.token,
        }
      }
    });
  }
}

export default SendAccountVerificationMailService;
