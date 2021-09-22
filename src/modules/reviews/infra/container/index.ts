import { container } from 'tsyringe';

import IReviewsRepository from '@modules/reviews/repositories/IReviewsRepository';
import ReviewsRepository from '../typeorm/repositories/ReviewsRepository';

import IReportsRepository from '@modules/reviews/repositories/IReportsRepository';
import ReportsRepository from '../typeorm/repositories/ReportsRepository';

container.registerSingleton<IReviewsRepository>(
  'ReviewsRepository',
  ReviewsRepository
);

container.registerSingleton<IReportsRepository>(
  'ReportsRepository',
  ReportsRepository
);
