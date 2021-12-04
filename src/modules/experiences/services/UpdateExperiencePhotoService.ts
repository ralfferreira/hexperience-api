import { inject, injectable } from "tsyringe";

import AppError from "@shared/errors/AppError";

import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import IExperiencesRepository from "../repositories/IExperiencesRepository";
import IExpPhotosRepository from "../repositories/IExpPhotosRepository";
import IStorageProvider from "@shared/container/providers/StorageProvider/models/IStorageProvider";

import { typeEnum } from "@modules/users/infra/typeorm/entities/User";
import Experience from "../infra/typeorm/entities/Experience";

interface IRequest {
  photo: string;
  user_id: number;
  exp_id: number;
  photo_id: number;
}

@injectable()
class UpdateExperiencePhotoService {
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

  public async execute({ photo, user_id, exp_id, photo_id }: IRequest): Promise<Experience> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Usuário não existe');
    }

    if (user.type !== typeEnum.host) {
      throw new AppError('Usuário não é um anfitrião');
    }

    const experience = await this.experiencesRepository.findById(exp_id);

    if (!experience) {
      throw new AppError('Experiência não existe');
    }

    if (experience.host.id !== user.host.id) {
      throw new AppError('Esse anfitrião não controla essa experiência');
    }

    const expPhoto = await this.expPhotosRepository.findById(photo_id);

    if (!expPhoto) {
      throw new AppError('Foto da experiência não existe');
    }

    if (expPhoto.experience.id !== experience.id) {
      throw new AppError('Foto não pertence a experiência');
    }

    await this.storageProvider.deleteFile(expPhoto.photo);

    const filename = await this.storageProvider.saveFile(photo);

    expPhoto.photo = filename;

    const updatedPhoto = await this.expPhotosRepository.update(expPhoto);

    const updatedExperience = await this.experiencesRepository.findById(updatedPhoto.experience.id);

    if (!updatedExperience) {
      throw new AppError('Experiência não existe');
    }

    return updatedExperience;
  }
}

export default UpdateExperiencePhotoService;
