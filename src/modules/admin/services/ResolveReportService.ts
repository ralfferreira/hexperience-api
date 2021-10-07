import { inject, injectable } from "tsyringe";

import AppError from "@shared/errors/AppError";

import Report from "@modules/reviews/infra/typeorm/entities/Report";

import IReportsRepository from "@modules/reviews/repositories/IReportsRepository";

@injectable()
class ResolveReportService {
  constructor (
    @inject('ReportsRepository')
    private reportsRepository: IReportsRepository
  ) {}

  public async execute(id: number): Promise<Report> {
    const report = await this.reportsRepository.findById(id);

    if (!report) {
      throw new AppError('Report does not exists');
    }

    if (report.is_resolved) {
      throw new AppError('Report is already resolved');
    }

    report.is_resolved = true;

    const resolvedReport = await this.reportsRepository.update(report);

    return resolvedReport;
  }
}

export default ResolveReportService;
