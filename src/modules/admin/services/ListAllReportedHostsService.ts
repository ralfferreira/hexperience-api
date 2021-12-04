import { inject, injectable } from "tsyringe";

import AppError from "@shared/errors/AppError";

import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import IReportsRepository from "@modules/reviews/repositories/IReportsRepository";

import { typeEnum } from "@modules/users/infra/typeorm/entities/User";
import Host from "@modules/users/infra/typeorm/entities/Host";
import { classToClass, plainToClass } from "class-transformer";

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
      throw new AppError('Usuário não existe');
    }

    if (user.type !== typeEnum.admin) {
      throw new AppError('Usuário não é administrador');
    }

    const reports = await this.reportsRepository.findAll();

    const stringReportedHosts = [...new Set(reports.map(report => JSON.stringify(classToClass(report.host))))];

    const reportedHosts = stringReportedHosts.map(entry => JSON.parse(entry));

    return reportedHosts;
  }
}

export default ListAllReportedHostsService;
