import { getRepository, Repository } from "typeorm";

import IReviewsRepository from "@modules/reviews/repositories/IReviewsRepository";

import Review from "../entities/Review";
import ICreateReviewDTO from "@modules/reviews/dtos/ICreateReviewDTO";

class ReviewsRepository implements IReviewsRepository {
  private ormRepository: Repository<Review>;

  constructor () {
    this.ormRepository = getRepository(Review, global.env.RDB_CONNECTION);
  }

  public async create({
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

  public async findByHostId(host_id: number): Promise<Review[]> {
    const reviews = await this.ormRepository.find({
      relations: ['user', 'experience', 'host'],
      where: {
        host: {
          id: host_id
        }
      }
    });

    return reviews;
  }

  public async findByExpId(exp_id: number): Promise<Review[]> {
    const reviews = await this.ormRepository.find({
      relations: ['user', 'experience', 'host'],
      where: {
        experience: {
          id: exp_id
        }
      }
    });

    return reviews;
  }
}

export default ReviewsRepository;
