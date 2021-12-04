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
      throw new AppError('Denúncia não existe');
    }

    if (report.is_resolved) {
      throw new AppError('Denúncia já foi resolvida');
    }

    report.is_resolved = true;

    const resolvedReport = await this.reportsRepository.update(report);

    return resolvedReport;
  }
}

export default ResolveReportService;
