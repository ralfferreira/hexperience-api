import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ReviewExperienceService from '@modules/reviews/services/ReviewExperienceService';
import UpdateReviewService from '@modules/reviews/services/UpdateReviewService';

export default class ReviewsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const { comment, rating, exp_id } = request.body;

    const reviewExperience = container.resolve(ReviewExperienceService);

    const review = await reviewExperience.execute({
      comment,
      rating,
      user_id: userId,
      exp_id: exp_id
    });

    return response.json(classToClass(review));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const { comment, rating, review_id } = request.body;

    const updateReview = container.resolve(UpdateReviewService);

    const updatedReview = await updateReview.execute({
      comment,
      rating,
      review_id,
      user_id: userId
    });

    return response.json(classToClass(updatedReview));
  }
}
