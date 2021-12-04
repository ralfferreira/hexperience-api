import { inject, injectable } from "tsyringe";

import AppError from "@shared/errors/AppError";

import AdminConfigure from "../infra/typeorm/entities/AdminConfigure";

import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import IAdminConfigureRepository from "../repositories/IAdminConfigureRepository";
import INotificationsRepository from "@modules/notifications/repositories/INotificationsRepository";
import { typeEnum } from "@modules/users/infra/typeorm/entities/User";

interface IRequest {
  reports_to_block: number;
  days_blocked: number;
  user_id: number;
}

@injectable()
class UpdateAdminConfigureService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('AdminConfigureRepository')
    private adminConfigureRepository: IAdminConfigureRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository
  ) {}

  public async execute({
    days_blocked,
    reports_to_block,
    user_id
  }: IRequest): Promise<AdminConfigure> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Usuário não existe');
    }

    if (user.type !== typeEnum.admin) {
      throw new AppError('Usuário não é administrador');
    }

    const adminConfigure = await this.adminConfigureRepository.findLatest();

    if (!adminConfigure) {
      throw new AppError('Configurações administrativas não foram encontradas');
    }

    if (
      adminConfigure.days_blocked === days_blocked &&
      adminConfigure.reports_to_block === reports_to_block
    ) {
      return adminConfigure
    }

    const admins = await this.usersRepository.findAllAdmins();

    const otherAdmins = admins.filter(admin => {
      if (admin.id !== user.id) {
        return admin;
      }
    });

    const newConfigure = await this.adminConfigureRepository.create({
      days_blocked,
      reports_to_block
    });

    for (const admin of otherAdmins) {
      await this.notificationsRepository.create({
        title: `Configurações de Admin foram atualizadas`,
        message:
          `O Admin ${user.name} atualizou as configurações de admin. ` +
          `Verifique se está tudo certo.`,
        receiver_id: admin.id,
      })
    }

    return newConfigure;
  }
}

export default UpdateAdminConfigureService;
