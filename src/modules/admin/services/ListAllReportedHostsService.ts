import { inject, injectable } from "tsyringe";

import AppError from "@shared/errors/AppError";

import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import IReportsRepository from "@modules/reviews/repositories/IReportsRepository";

import { typeEnum } from "@modules/users/infra/typeorm/entities/User";
import Host from "@modules/users/infra/typeorm/entities/Host";

@injectable()
class ListAllReportedHostsService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ReportsRepository')
    private reportsRepository: IReportsRepository
  ) {}

  public async execute(user_id: number): Promise<Host[]> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    if (user.type !== typeEnum.admin) {
      throw new AppError('Only admins can do this');
    }

    const reports = await this.reportsRepository.findAll();

    const reportedHosts = reports.map(report => report.host);

    return reportedHosts;
  }
}

export default ListAllReportedHostsService;
