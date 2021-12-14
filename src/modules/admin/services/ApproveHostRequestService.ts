import { injectable, inject } from "tsyringe";

import AppError from "@shared/errors/AppError";

import { typeEnum } from "@modules/users/infra/typeorm/entities/User";

import Host from "@modules/users/infra/typeorm/entities/Host";

import IHostRequestsRepository from "@modules/users/repositories/IHostRequestsRepository";
import IHostsRepository from "@modules/users/repositories/IHostsRepository";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import INotificationsRepository from "@modules/notifications/repositories/INotificationsRepository";

@injectable()
class ApproveHostRequestService {
  constructor (
    @inject('HostRequestsRepository')
    private hostRequestsRepository: IHostRequestsRepository,

    @inject('HostsRepository')
    private hostsRepository: IHostsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository
  ) {}

  public async execute(user_id: number): Promise<Host> {
    const hostRequest = await this.hostRequestsRepository.findByUserId(user_id);

    if (!hostRequest) {
      throw new AppError('Solicitação não foi encontrada');
    }

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Usuário não existe');
    }

    if (user.type === typeEnum.host) {
      throw new AppError('Usuário já é um anfitrião');
    }

    user.type = typeEnum.host;

    const updatedUser = await this.usersRepository.update(user);

    const host = await this.hostsRepository.create({
      cpf: hostRequest?.cpf,
      cnpj: hostRequest?.cnpj,
      nickname: hostRequest.nickname,
      user: updatedUser
    });

    await this.hostRequestsRepository.delete(updatedUser.id);

    await this.notificationsRepository.create({
      title: 'Parabéns, solicitação aceita!',
      message:
        'Sua solicitação para se tornar um anfitrião foi revisada pela nossa equipe, ' +
        'e você foi aprovado! Você pode oferecer experiências agora',
      receiver_id: updatedUser.id,
      host_id: host.id,
    });

    return host;
  }
}

export default ApproveHostRequestService;
