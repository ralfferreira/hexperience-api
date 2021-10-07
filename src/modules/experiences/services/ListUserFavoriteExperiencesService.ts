import { inject, injectable } from "tsyringe";

import AppError from "@shared/errors/AppError";

import IUsersRepository from "@modules/users/repositories/IUsersRepository";

import Favorite from "../infra/typeorm/entities/Favorite";
import IFavoritesRepository from "../repositories/IFavoritesRepository";

@injectable()
class ListUserFavoriteExperiencesService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('FavoritesRepository')
    private favoritesRepository: IFavoritesRepository
  ) {}

  public async execute(user_id: number): Promise<Favorite[]> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    const favorites = await this.favoritesRepository.findByUserId(user.id);

    return favorites;
  }
}

export default ListUserFavoriteExperiencesService;
