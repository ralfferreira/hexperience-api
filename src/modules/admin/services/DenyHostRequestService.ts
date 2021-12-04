import { inject, injectable } from "tsyringe";
import path from 'path';

import AppError from "@shared/errors/AppError";

import IHostRequestsRepository from "@modules/users/repositories/IHostRequestsRepository";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import IMailProvider from "@shared/container/providers/MailProvider/models/IMailProvider";
import INotificationsRepository from "@modules/notifications/repositories/INotificationsRepository";

interface IRequest {
  user_id: number;
  reason: string;
}

@injectable()
class DenyHostRequestService {
  constructor (
    @inject('HostRequestsRepository')
    private hostRequestsRepository: IHostRequestsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository
  ) {}

  public async execute({ user_id, reason }: IRequest): Promise<void> {
    const hostRequest = await this.hostRequestsRepository.findByUserId(user_id);

    if (!hostRequest) {
      throw new AppError('Solicitação não foi encontrada');
    }

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Usuário não existe');
    }

    const denyHostTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'deny_host.hbs'
    );

    await this.notificationsRepository.create({
      title: 'Solicitação de privilégio negada',
      message:
        'Sua solicitação de privilégio de anfitrião foi negada. ' +
        'Um email foi enviado detalhando a situação.',
      receiver_id: user.id,
    });

    await this.hostRequestsRepository.delete(user.id);

    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email
      },
      subject: '[Hexperience] Solicitação de Privilégio de Anfitrião Negada',
      templateData: {
        file: denyHostTemplate,
        variables: {
          name: user.name,
          reason: reason
        }
      }
    });
  }
}

export default DenyHostRequestService;
