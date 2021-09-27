import { Repository, getRepository } from "typeorm";

import Favorite from "../entities/Favorite";

import IFavoritesRepository from "@modules/experiences/repositories/IFavoritesRepository";

import ICreateFavoriteDTO from "@modules/experiences/dtos/ICreateFavoriteDTO";

class FavoritesRepository implements IFavoritesRepository {
  private ormRepository: Repository<Favorite>;

  constructor () {
    this.ormRepository = getRepository(Favorite);
  }

  public async create({ folder, user, experience }: ICreateFavoriteDTO): Promise<Favorite> {
    const favorite = await this.ormRepository.create({
      folder,
      user,
      experience
    });

    await this.ormRepository.save(favorite);

    return favorite;
  }

  public async findOne(user_id: number, exp_id: number): Promise<Favorite | undefined> {
    const favorite = await this.ormRepository.findOne({
      relations: ['user', 'experience'],
      where: {
        experience: {
          id: exp_id
        },
        user: {
          id: user_id
        }
      }
    });

    return favorite;
  }

  public async update(favorite: Favorite): Promise<Favorite> {
    return this.ormRepository.save(favorite);
  }

  public async delete(favorite: Favorite): Promise<void> {
    await this.ormRepository.remove(favorite);
  }
}

export default FavoritesRepository;
