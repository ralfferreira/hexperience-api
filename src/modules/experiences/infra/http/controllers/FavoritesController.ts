import { Request, Response } from "express";
import { container } from "tsyringe";

import AddExperienceToFavoritesService from "@modules/experiences/services/AddExperienceToFavoritesService";

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

    return response.json(favorite);
  }
}
