import { inject, injectable } from "tsyringe";

import Review from "../infra/typeorm/entities/Review";

import IHostsRepository from "@modules/users/repositories/IHostsRepository";
import IReviewsRepository from "../repositories/IReviewsRepository";

import AppError from "@shared/errors/AppError";

@injectable()
class ListAllHostReviewsService {
  constructor (
    @inject('HostsRepository')
    private hostsRepository: IHostsRepository,

    @inject('ReviewsRepository')
    private reviewsRepository: IReviewsRepository,
  ) {}

  public async execute(host_id: number): Promise<Review[]> {
    const host = await this.hostsRepository.findById(host_id);

    if (!host) {
      throw new AppError('Host does not exists');
    }

    const reviews = await this.reviewsRepository.findByHostId(host.id);

    return reviews;
  }
}

export default ListAllHostReviewsService;
