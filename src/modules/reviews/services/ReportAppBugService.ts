import { inject, injectable } from "tsyringe";

import AppError from "@shared/errors/AppError";

import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import IAppBugsRepository from "@modules/admin/repositories/IAppBugsRepository";
import INotificationsRepository from "@modules/notifications/repositories/INotificationsRepository";

import { AppBugType } from '@modules/admin/infra/mongoose/schemas/AppBug';

interface IRequest {
  where: string;
  what: string;
  description: string;
  user_id: number;
}

@injectable()
class ReportAppBugService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('AppBugsRepository')
    private appBugsRepository: IAppBugsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository
  ) {}

  public async execute({ where, what, description, user_id }: IRequest): Promise<AppBugType> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Usuário não existe');
    }

    const appBug = await this.appBugsRepository.create({
      what,
      where,
      description
    });

    const admins = await this.usersRepository.findAllAdmins();

    for (const admin of admins) {
      await this.notificationsRepository.create({
        title: 'Um erro no sistema foi reportado',
        message:
          `Um erro no aplicativo foi reportado. ` +
          `Verifique e tome as providências necessárias.`,
        receiver_id: admin.id,
      });
    }

    return appBug;
  }
}

export default ReportAppBugService;
