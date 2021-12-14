import { inject, injectable } from "tsyringe";

import AppError from "@shared/errors/AppError";

import Favorite from "../infra/typeorm/entities/Favorite";

import IExperiencesRepository from "../repositories/IExperiencesRepository";
import IFavoritesRepository from "../repositories/IFavoritesRepository";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";

interface IRequest {
  user_id: number;
  exp_id: number;
  folder?: string;
}

@injectable()
class UpdateFavoriteService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ExperiencesRepository')
    private experiencesRepository: IExperiencesRepository,

    @inject('FavoritesRepository')
    private favoritesRepository: IFavoritesRepository
  ) {}

  public async execute({ user_id, exp_id, folder }: IRequest): Promise<Favorite> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Usuário não existe');
    }

    const experience = await this.experiencesRepository.findById(exp_id);

    if (!experience) {
      throw new AppError('Experiência não existe');
    }

    const favorite = await this.favoritesRepository.findOne(user.id, experience.id);

    if (!favorite) {
      throw new AppError('Experiência não é favorita');
    }

    favorite.folder = folder;

    const updatedFavorite = await this.favoritesRepository.update(favorite);

    return updatedFavorite;
  }
}

export default UpdateFavoriteService;
