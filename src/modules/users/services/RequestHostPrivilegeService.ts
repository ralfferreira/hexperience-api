import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import { HostRequest as HostRequestType } from '../infra/mongoose/schemas/HostRequest';

import ICreateHostRequestDTO from '../dtos/ICreateHostRequestDTO';
import IHostRequestRepository from '../repositories/IHostRequestRepository';

@injectable()
class RequestHostPrivilegeService {
  constructor (
    @inject('HostRequestRepository')
    private hostRequestRepository: IHostRequestRepository,
  ) {}

  public async execute(data: ICreateHostRequestDTO): Promise<HostRequestType> {
    const checkIfAlreadyRequested = await this.hostRequestRepository.findByUserId(data.user_id);

    if (checkIfAlreadyRequested) {
      throw new AppError('User had already requested Host privilege');
    }

    const checkNickname = await this.hostRequestRepository.findByNickname(data.nickname);

    if (checkNickname) {
      throw new AppError('Nickname already been used!');
    }

    const hostRequest = await this.hostRequestRepository.create(data);

    return hostRequest;
  }
}

export default RequestHostPrivilegeService;