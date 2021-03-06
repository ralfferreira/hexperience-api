import { inject, injectable } from "tsyringe";

import AppError from "@shared/errors/AppError";

import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import IExperiencesRepository from "../repositories/IExperiencesRepository";
import IFavoritesRepository from "../repositories/IFavoritesRepository";

interface IRequest {
  user_id: number;
  exp_id: number;
}

@injectable()
class RemoveExperienceFromFavorites {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ExperiencesRepository')
    private experiencesRepository: IExperiencesRepository,

    @inject('FavoritesRepository')
    private favoritesRepository: IFavoritesRepository
  ) {}

  public async execute({ exp_id, user_id }: IRequest): Promise<void> {
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
      throw new AppError('Experience não é favorita')
    }

    await this.favoritesRepository.delete(favorite);
  }
}

export default RemoveExperienceFromFavorites;
