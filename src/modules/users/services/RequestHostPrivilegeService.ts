import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import { HostRequestType } from '../infra/mongoose/schemas/HostRequests';

import { statusEnum, typeEnum } from '../infra/typeorm/entities/User';

import ICreateHostRequestDTO from '../dtos/ICreateHostRequestDTO';
import IHostRequestsRepository from '../repositories/IHostRequestsRepository';
import IHostsRepository from '../repositories/IHostsRepository';
import IUsersRepository from '../repositories/IUsersRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';

@injectable()
class RequestHostPrivilegeService {
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

  public async execute(data: ICreateHostRequestDTO): Promise<HostRequestType> {
    const checkIfAlreadyRequested = await this.hostRequestsRepository.findByUserId(data.user_id);

    if (checkIfAlreadyRequested) {
      throw new AppError('User had already requested Host privilege');
    }

    const checkIfAlreadyIsHost = await this.usersRepository.findById(data.user_id);

    if (checkIfAlreadyIsHost?.type === typeEnum.host) {
      throw new AppError('User is already a Host');
    }

    if (checkIfAlreadyIsHost?.status !== statusEnum.ok) {
      throw new AppError('Only users that are not under analysis or blocked can request host privilege');
    }

    const checkNickname = await this.hostRequestsRepository.findByNickname(data.nickname);

    if (checkNickname) {
      throw new AppError('Nickname already been used!');
    }

    const checkIfNickname = await this.hostsRepository.findByNickname(data.nickname);

    if (checkIfNickname) {
      throw new AppError('User is already a Host');
    }

    if (!data.cpf && !data.cnpj) {
      throw new AppError('CPF and CNPJ were not informed. At least, one of them is required')
    }

    const hostRequest = await this.hostRequestsRepository.create(data);

    const admins = await this.usersRepository.findAllAdmins();

    for (const admin of admins) {
      await this.notificationsRepository.create({
        title: 'Nova solicitação de anfitrião',
        message:
          'Um usuário solicitou o privilégio de anfitrião. Verifique ' +
          'se ele cumpre os requisitos para se tornar um anfitrião.',
        receiver_id: admin.id,
      });
    }

    return hostRequest;
  }
}

export default RequestHostPrivilegeService;
