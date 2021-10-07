import { inject, injectable } from "tsyringe";

import AppError from "@shared/errors/AppError";

import Report from "../infra/typeorm/entities/Report";

import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import IHostsRepository from "@modules/users/repositories/IHostsRepository";
import IReportsRepository from "../repositories/IReportsRepository";
import INotificationsRepository from "@modules/notifications/repositories/INotificationsRepository";

interface IRequest {
  comment: string;
  reason: string;
  user_id: number;
  host_id: number;
}

@injectable()
class ReportHostService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HostsRepository')
    private hostsRepository: IHostsRepository,

    @inject('ReportsRepository')
    private reportsRepository: IReportsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository
  ) {}

  public async execute({ comment, reason, user_id, host_id }: IRequest): Promise<Report> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    const host = await this.hostsRepository.findById(host_id);

    if (!host) {
      throw new AppError('Host does not exists');
    }

    if (user.id === host.user.id) {
      throw new AppError('You can not report yourself');
    }

    const report = await this.reportsRepository.create({
      comment,
      reason,
      host
    });

    const admins = await this.usersRepository.findAllAdmins();

    for (const admin of admins) {
      await this.notificationsRepository.create({
        title: 'Nova denúcia recebida',
        message:
          `O anfitrião ${host.nickname} recebeu uma nova denúnica. ` +
          `Verifique a denúncia e avalie o caso.`,
        receiver_id: admin.id,
        host_id: admin.id
      });
    }

    await this.notificationsRepository.create({
      title: 'Você foi reportado',
      message:
        `Você foi reportado por ${reason}. Verifique sua contuda.`,
      receiver_id: host.user.id,
      host_id: host.id
    })

    return report;
  }
}

export default ReportHostService;
