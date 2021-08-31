import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ReviewExperienceService from '@modules/reviews/services/ReviewExperienceService';

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

    return response.json(review);
  }
}
