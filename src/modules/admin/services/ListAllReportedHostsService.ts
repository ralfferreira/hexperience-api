import { inject, injectable } from "tsyringe";

import AppError from "@shared/errors/AppError";

import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import IHostsRepository from "@modules/users/repositories/IHostsRepository";

import { typeEnum } from "@modules/users/infra/typeorm/entities/User";
import Host from "@modules/users/infra/typeorm/entities/Host";

@injectable()
class ListAllReportedHostsService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HostsRepository')
    private hostsRepository: IHostsRepository
  ) {}

  public async execute(user_id: number): Promise<Host[]> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    if (user.type !== typeEnum.admin) {
      throw new AppError('Only admins can do this');
    }

    const reportedHosts = await this.hostsRepository.findAllReported();

    return reportedHosts;
  }
}

export default ListAllReportedHostsService;
