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
      throw new AppError('User does not exists');
    }

    if (user.type !== typeEnum.host) {
      throw new AppError('User is not authorized to do this action');
    }

    const experience = await this.experiencesRepository.findById(experience_id);

    if (!experience) {
      throw new AppError('Experience does not exists');
    }

    if (experience.is_blocked) {
      throw new AppError('Experience is blocked')
    }

    if (experience.host.id !== user.host.id) {
      throw new AppError('Host does not own this experience');
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
