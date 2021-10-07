import { inject, injectable } from "tsyringe";

import Review from "../infra/typeorm/entities/Review";

import IExperiencesRepository from "@modules/experiences/repositories/IExperiencesRepository";
import IReviewsRepository from "../repositories/IReviewsRepository";

import AppError from "@shared/errors/AppError";

@injectable()
class ListAllExperienceReviewsService {
  constructor (
    @inject('ExperiencesRepository')
    private experiencesRepository: IExperiencesRepository,

    @inject('ReviewsRepository')
    private reviewsRepository: IReviewsRepository
  ) {}

  public async execute(exp_id: number): Promise<Review[]> {
    const experience = await this.experiencesRepository.findById(exp_id);

    if (!experience) {
      throw new AppError('Experience does not exists');
    }

    const reviews = await this.reviewsRepository.findByExpId(experience.id);

    return reviews;
  }
}

export default ListAllExperienceReviewsService;
