import { inject, injectable } from "tsyringe";

import IStorageProvider from "@shared/container/providers/StorageProvider/models/IStorageProvider";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import IExperiencesRepository from "../repositories/IExperiencesRepository";

import Experience from "../infra/typeorm/entities/Experience";
import AppError from "@shared/errors/AppError";
import { typeEnum } from "@modules/users/infra/typeorm/entities/User";

interface IRequest {
  photo: string;
  user_id: number;
  experience_id: number;
}

@injectable()
class UpdateExperienceCoverService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ExperiencesRepository')
    private experiencesRepository: IExperiencesRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({ photo, user_id, experience_id }: IRequest): Promise<Experience> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Usuário não existe');
    }

    if (user.type !== typeEnum.host) {
      throw new AppError('Usuário não é anfitrião');
    }

    const experience = await this.experiencesRepository.findById(experience_id);

    if (!experience) {
      throw new AppError('Experiência não existe');
    }

    if (experience.is_blocked) {
      throw new AppError('Experiência está bloqueada')
    }

    if (experience.host.id !== user.host.id) {
      throw new AppError('Esse anfitrião não controla essa experiência');
    }

    if (experience.cover) {
      await this.storageProvider.deleteFile(experience.cover);
    }

    const filename = await this.storageProvider.saveFile(photo);

    experience.cover = filename;

    await this.experiencesRepository.update(experience);

    return experience;
  }
}

export default UpdateExperienceCoverService;
