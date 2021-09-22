import { inject, injectable } from "tsyringe";

import AppError from "@shared/errors/AppError";

import ExpPhoto from "../infra/typeorm/entities/ExpPhoto";

import IExpPhotosRepository from "../repositories/IExpPhotosRepository";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import IExperiencesRepository from "../repositories/IExperiencesRepository";
import IStorageProvider from "@shared/container/providers/StorageProvider/models/IStorageProvider";

import { typeEnum } from "@modules/users/infra/typeorm/entities/User";

interface IRequest {
  photo: string;
  user_id: number;
  experience_id: number;
}

@injectable()
class AddExperiencePhotoService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ExperiencesRepository')
    private experiencesRepository: IExperiencesRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,

    @inject('ExpPhotosRepository')
    private expPhotosRepository: IExpPhotosRepository
  ) {}

  public async execute({ photo, user_id, experience_id }: IRequest): Promise<ExpPhoto> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    if (user.type !== typeEnum.host) {
      throw new AppError('User is not a host');
    }

    const experience = await this.experiencesRepository.findById(experience_id);

    if (!experience) {
      throw new AppError('Experience does not exists');
    }

    if (experience.host.id !== user.host.id) {
      throw new AppError('Host does not own this experience');
    }

    if (experience.photos.length >= 5) {
      throw new AppError('Max of photos has been reached. Chage one of the photos');
    }

    const filename = await this.storageProvider.saveFile(photo);

    const expPhoto = await this.expPhotosRepository.create({
      photo: filename,
      experience: experience
    });

    return expPhoto;
  }
}

export default AddExperiencePhotoService;
