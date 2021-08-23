import { injectable, inject } from "tsyringe";

import AppError from "@shared/errors/AppError";

import { typeEnum } from "@modules/users/infra/typeorm/entities/User";

import Host from "@modules/users/infra/typeorm/entities/Host";

import IHostRequestsRepository from "@modules/users/repositories/IHostRequestsRepository";
import IHostsRepository from "@modules/users/repositories/IHostsRepository";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";

@injectable()
class ApproveHostRequestService {
  constructor (
    @inject('HostRequestsRepository')
    private hostRequestsRepository: IHostRequestsRepository,

    @inject('HostsRepository')
    private hostsRepository: IHostsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(user_id: number): Promise<Host> {
    const hostRequest = await this.hostRequestsRepository.findByUserId(user_id);

    if (!hostRequest) {
      throw new AppError('Request was not found');
    }

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    if (user.type === typeEnum.host) {
      throw new AppError('User is already a Host');
    }

    user.type = typeEnum.host;

    const updatedUser = await this.usersRepository.update(user);

    const host = await this.hostsRepository.create({
      cpf: hostRequest?.cpf,
      cnpj: hostRequest?.cnpj,
      nickname: hostRequest.nickname,
      user: updatedUser
    });

    return host;
  }
}

export default ApproveHostRequestService;
