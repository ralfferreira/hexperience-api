import { getRepository, Repository } from "typeorm";

import IReviewsRepository from "@modules/reviews/repositories/IReviewsRepository";

import Review from "../entities/Review";
import ICreateReviewDTO from "@modules/reviews/dtos/ICreateReviewDTO";

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
}

export default ReviewsRepository;
