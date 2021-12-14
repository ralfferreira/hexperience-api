import { inject, injectable } from "tsyringe";

import AppError from "@shared/errors/AppError";

import Favorite from "../infra/typeorm/entities/Favorite";

import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import IExperiencesRepository from "../repositories/IExperiencesRepository";
import IFavoritesRepository from "../repositories/IFavoritesRepository";

import { typeEnum } from "@modules/users/infra/typeorm/entities/User";

interface IRequest {
  user_id: number;
  exp_id: number;
  folder?: string;
}

@injectable()
class AddExperienceToFavoritesService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ExperiencesRepository')
    private experiencesRepository: IExperiencesRepository,

    @inject('FavoritesRepository')
    private favoritesRepository: IFavoritesRepository
  ) {}

  public async execute({ folder, exp_id, user_id }: IRequest): Promise<Favorite> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Usuário não existe');
    }

    const experience = await this.experiencesRepository.findById(exp_id);

    if (!experience) {
      throw new AppError('Experiência não existe');
    }

    if (user.type === typeEnum.host) {
      if (experience.host.id === user.host.id) {
        throw new AppError('Usuário não pode favoritar uma experiência oferecida por ele mesmo');
      }
    }

    const checkIfAlreadyIsFavorite = await this.favoritesRepository.findOne(
      user.id,
      experience.id
    );

    if (checkIfAlreadyIsFavorite) {
      throw new AppError('Experiência já é favorita');
    }

    const favorite = await this.favoritesRepository.create({
      experience,
      user,
      folder,
    });

    return favorite;
  }
}

export default AddExperienceToFavoritesService;
