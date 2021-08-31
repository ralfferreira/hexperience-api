import { container } from 'tsyringe';

import IReviewsRepository from '@modules/reviews/repositories/IReviewsRepository';
import ReviewsRepository from '../typeorm/repositories/ReviewsRepository';

container.registerSingleton<IReviewsRepository>(
  'ReviewsRepository',
  ReviewsRepository
);
