import { inject, injectable } from "tsyringe";

import AppError from "@shared/errors/AppError";

import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import IExperiencesRepository from "@modules/experiences/repositories/IExperiencesRepository";

import Experience from "@modules/experiences/infra/typeorm/entities/Experience";
import { typeEnum } from "@modules/users/infra/typeorm/entities/User";

@injectable()
class ListAllBlockedExperiencesService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ExperiencesRepository')
    private experiencesRepository: IExperiencesRepository
  ) {}

  public async execute(user_id: number): Promise<Experience[]> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    if (user.type !== typeEnum.admin) {
      throw new AppError('User is not an admin');
    }

    const blockedExperiences = await this.experiencesRepository.findAllBlocked();

    return blockedExperiences;
  }
}

export default ListAllBlockedExperiencesService;
