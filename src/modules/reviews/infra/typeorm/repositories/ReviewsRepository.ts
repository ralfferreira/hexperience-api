import { getRepository, Repository } from "typeorm";

import IReviewsRepository from "@modules/reviews/repositories/IReviewsRepository";

import Review from "../entities/Review";
import ICreateReviewDTO from "@modules/reviews/dtos/ICreateReviewDTO";
import ICreateReportDTO from "@modules/reviews/dtos/ICreateReportDTO";

class ReviewsRepository implements IReviewsRepository {
  private ormRepository: Repository<Review>;

  constructor () {
    this.ormRepository = getRepository(Review);
  }

  public async createReview({
    comment,
    rating,
    user,
    host,
    experience
  }: ICreateReviewDTO): Promise<Review> {
    const review = await this.ormRepository.create({
      comment,
      rating,
    });

    review.user = user;
    review.host = host;
    review.experience = experience;

    await this.ormRepository.save(review);

    return review;
  }

  public async createReport({
    comment,
    reason,
    experience,
    host,
  }: ICreateReportDTO): Promise<Review> {
    const report = await this.ormRepository.create({
      comment,
      reason,
      is_complaint: true
    });

    report.host = host;
    report.experience = experience;

    await this.ormRepository.save(report);

    return report;
  }

  public async findById(id: number): Promise<Review | undefined> {
    const review = await this.ormRepository.findOne({
      relations: ['user', 'experience', 'host'],
      where: {
        id: id
      }
    });

    return review;
  }

  public async update(review: Review): Promise<Review> {
    return this.ormRepository.save(review);
  }
}

export default ReviewsRepository;
