import ICreateFavoriteDTO from "../dtos/ICreateFavoriteDTO";
import Favorite from "../infra/typeorm/entities/Favorite";

export default interface IFavoritesRepository {
  create(data: ICreateFavoriteDTO): Promise<Favorite>;
  findOne(user_id: number, exp_id: number): Promise<Favorite | undefined>;
  delete(favorite: Favorite): Promise<void>;
}
