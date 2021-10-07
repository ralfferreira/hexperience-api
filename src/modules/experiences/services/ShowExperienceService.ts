import { inject, injectable } from "tsyringe";

import AppError from "@shared/errors/AppError";

import Experience from "../infra/typeorm/entities/Experience";
import IExperiencesRepository from "../repositories/IExperiencesRepository";

@injectable()
class ShowExperienceService {
  constructor (
    @inject('ExperiencesRepository')
    private experiencesRepository: IExperiencesRepository,
  ) {}

  public async execute(id: number): Promise<Experience> {
    const experience = await this.experiencesRepository.findById(id);

    if (!experience) {
      throw new AppError('Experience does not exists');
    }

    return experience;
  }
}

export default ShowExperienceService;
