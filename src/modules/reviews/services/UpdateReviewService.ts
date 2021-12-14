import { inject, injectable } from "tsyringe";

import Review from "../infra/typeorm/entities/Review";

import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import IReviewsRepository from "../repositories/IReviewsRepository";
import AppError from "@shared/errors/AppError";

interface IRequest {
  comment: string;
  rating: number;
  user_id: number;
  review_id: number;
}

@injectable()
class UpdateReviewService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ReviewsRepository')
    private reviewsRepository: IReviewsRepository
  ) {}

  public async execute({ comment, rating, review_id, user_id }: IRequest): Promise<Review> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Usuário não existe');
    }

    const review = await this.reviewsRepository.findById(review_id);

    if (!review) {
      throw new AppError('Avalição não existe');
    }

    if (review.user.id !== user.id) {
      throw new AppError('Usuário não pode atualizar uma avaliação que ele não fez');
    }

    review.comment = comment;
    review.rating = rating;

    const updatedReview = await this.reviewsRepository.update(review);

    return updatedReview;
  }
}

export default UpdateReviewService;
