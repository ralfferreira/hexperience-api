import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import { HostRequest as HostRequestType } from '../infra/mongoose/schemas/HostRequest';

import { typeEnum } from '../infra/typeorm/entities/User';

import ICreateHostRequestDTO from '../dtos/ICreateHostRequestDTO';
import IHostRequestRepository from '../repositories/IHostRequestRepository';
import IHostsRepository from '../repositories/IHostsRepository';
import IUsersRepository from '../repositories/IUsersRepository';

@injectable()
class RequestHostPrivilegeService {
  constructor (
    @inject('HostRequestRepository')
    private hostRequestRepository: IHostRequestRepository,

    @inject('HostsRepository')
    private hostsRepository: IHostsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute(data: ICreateHostRequestDTO): Promise<HostRequestType> {
    const checkIfAlreadyRequested = await this.hostRequestRepository.findByUserId(data.user_id);

    if (checkIfAlreadyRequested) {
      throw new AppError('User had already requested Host privilege');
    }

    const checkIfAlreadyIsHost = await this.usersRepository.findById(data.user_id);

    if (checkIfAlreadyIsHost?.type === typeEnum.host) {
      throw new AppError('User is already a Host');
    }

    const checkNickname = await this.hostRequestRepository.findByNickname(data.nickname);

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

    const hostRequest = await this.hostRequestRepository.create(data);

    return hostRequest;
  }
}

export default RequestHostPrivilegeService;
