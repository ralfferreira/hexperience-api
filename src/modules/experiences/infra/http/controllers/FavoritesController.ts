import { Request, Response } from "express";
import { container } from "tsyringe";
import { classToClass } from "class-transformer";

import AddExperienceToFavoritesService from "@modules/experiences/services/AddExperienceToFavoritesService";
import RemoveExperienceFromFavorites from "@modules/experiences/services/RemoveExperienceFromFavorites";
import UpdateFavoriteService from "@modules/experiences/services/UpdateFavoriteService";
import ListUserFavoriteExperiencesService from "@modules/experiences/services/ListUserFavoriteExperiencesService";

export default class FavoritesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const { exp_id, folder } = request.body;

    const addExperienceToFavorites = container.resolve(AddExperienceToFavoritesService);

    const favorite = await addExperienceToFavorites.execute({
      exp_id,
      folder,
      user_id: userId
    });

    return response.json(classToClass(favorite));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const { exp_id } = request.params;

    const removeExperienceFromFavorites = container.resolve(RemoveExperienceFromFavorites);

    await removeExperienceFromFavorites.execute({
      exp_id: Number(exp_id),
      user_id: userId
    });

    return response.status(204).json({});
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const { exp_id } = request.params;
    const { folder } = request.body;

    const updateFavorite = container.resolve(UpdateFavoriteService);

    const favorite = await updateFavorite.execute({
      folder,
      exp_id: Number(exp_id),
      user_id: userId
    });

    return response.json(classToClass(favorite));
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const listUserFavoriteExperiences = container.resolve(ListUserFavoriteExperiencesService);

    const favorite = await listUserFavoriteExperiences.execute(userId);

    return response.json(classToClass(favorite));
  }
}
