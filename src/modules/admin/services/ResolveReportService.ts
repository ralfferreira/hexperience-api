import { inject, injectable } from "tsyringe";

import AppError from "@shared/errors/AppError";

import Review from "@modules/reviews/infra/typeorm/entities/Review";

import IReviewsRepository from "@modules/reviews/repositories/IReviewsRepository";

@injectable()
class ResolveReportService {
  constructor (
    @inject('ReviewsRepository')
    private reviewsRepository: IReviewsRepository
  ) {}

  public async execute(id: number): Promise<Review> {
    const report = await this.reviewsRepository.findById(id);

    if (!report) {
      throw new AppError('Report does not exists');
    }

    if (!report.is_complaint) {
      throw new AppError('Report does not exists');
    }

    if (report.is_resolved) {
      throw new AppError('Report is already resolved');
    }

    report.is_resolved = true;

    const resolvedReport = await this.reviewsRepository.update(report);

    return resolvedReport;
  }
}

export default ResolveReportService;
