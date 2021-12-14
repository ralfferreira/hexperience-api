import { inject, injectable } from "tsyringe";

import Experience from "@modules/experiences/infra/typeorm/entities/Experience";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import IExperiencesRepository from "@modules/experiences/repositories/IExperiencesRepository";
import AppError from "@shared/errors/AppError";
import { typeEnum } from "@modules/users/infra/typeorm/entities/User";

@injectable()
class ListAllReportedExperiencesService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ExperiencesRepository')
    private experiencesRepository: IExperiencesRepository
  ) {}

  public async execute(user_id: number): Promise<Experience[]> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Usuário não existe');
    }

    if (user.type !== typeEnum.admin) {
      throw new AppError('Usuário não é administrador');
    }

    const reportedExperiences = await this.experiencesRepository.findAllReported()

    return reportedExperiences;
  }
}

export default ListAllReportedExperiencesService;
