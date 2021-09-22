import { inject, injectable } from "tsyringe";

import AppError from "@shared/errors/AppError";

import IUsersRepository from "@modules/users/repositories/IUsersRepository";

import IExperiencesRepository from "../repositories/IExperiencesRepository";
import IExpPhotosRepository from "../repositories/IExpPhotosRepository";
import IStorageProvider from "@shared/container/providers/StorageProvider/models/IStorageProvider";

import { typeEnum } from "@modules/users/infra/typeorm/entities/User";

interface IRequest {
  user_id: number;
  exp_id: number;
  photo_id: number;
}

@injectable()
class DeleteExperiencePhotoService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ExperiencesRepository')
    private experiencesRepository: IExperiencesRepository,

    @inject('ExpPhotosRepository')
    private expPhotosRepository: IExpPhotosRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider
  ) {}

  public async execute({ user_id, exp_id, photo_id }: IRequest): Promise<void> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    if (user.type !== typeEnum.host) {
      throw new AppError('User is not a host');
    }

    const experience = await this.experiencesRepository.findById(exp_id);

    if (!experience) {
      throw new AppError('Experience does not exists');
    }

    if (experience.host.id !== user.host.id) {
      throw new AppError('Host does not own this experience');
    }

    if (experience.photos.length <= 1) {
      throw new AppError('Experience need to have at least one photo');
    }

    const photo = await this.expPhotosRepository.findById(photo_id);

    if (!photo) {
      throw new AppError('Photo does not exists');
    }

    if (photo.experience.id !== experience.id) {
      throw new AppError('Photo does not belongs to this experience');
    }

    await this.storageProvider.deleteFile(photo.photo);

    await this.expPhotosRepository.delete(photo);
  }
}

export default DeleteExperiencePhotoService;
