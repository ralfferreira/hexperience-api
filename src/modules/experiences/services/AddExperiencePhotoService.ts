import { inject, injectable } from "tsyringe";

import AppError from "@shared/errors/AppError";

import ExpPhoto from "../infra/typeorm/entities/ExpPhoto";

import IExpPhotosRepository from "../repositories/IExpPhotosRepository";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import IExperiencesRepository from "../repositories/IExperiencesRepository";
import IStorageProvider from "@shared/container/providers/StorageProvider/models/IStorageProvider";

import { typeEnum } from "@modules/users/infra/typeorm/entities/User";
import Experience from "../infra/typeorm/entities/Experience";

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

    if (experience.photos.length >= 4) {
      throw new AppError('Limite de fotos foi atingido, altere ou delete uma das fotos');
    }

    const filename = await this.storageProvider.saveFile(photo);

    const expPhoto = await this.expPhotosRepository.create({
      photo: filename,
      experience: experience
    });

    const updatedExperience = await this.experiencesRepository.findById(expPhoto.experience.id);

    if (!updatedExperience) {
      throw new AppError('Experiência não existe');
    }

    return updatedExperience;
  }
}

export default AddExperiencePhotoService;
