import { inject, injectable } from "tsyringe";

import AppError from "@shared/errors/AppError";

import Report from "../infra/typeorm/entities/Report";

import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import IReportsRepository from "../repositories/IReportsRepository";
import { typeEnum } from "@modules/users/infra/typeorm/entities/User";

interface IRequest {
  user_id: number;
  report_id: number;
}

@injectable()
class ShowReportService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ReportsRepository')
    private reportsRepository: IReportsRepository
  ) {}

  public async execute({ user_id, report_id }: IRequest): Promise<Report> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    if (user.type !== typeEnum.admin) {
      throw new AppError('Only admins can do this');
    }

    const report = await this.reportsRepository.findById(report_id);

    if (!report) {
      throw new AppError('Report does not exists');
    }

    return report;
  }
}

export default ShowReportService;
