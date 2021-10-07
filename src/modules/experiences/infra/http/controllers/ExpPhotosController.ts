import { Request, Response } from "express";
import { container } from "tsyringe";

import AddExperiencePhotoService from "@modules/experiences/services/AddExperiencePhotoService";
import UpdateExperiencePhotoService from "@modules/experiences/services/UpdateExperiencePhotoService";
import DeleteExperiencePhotoService from "@modules/experiences/services/DeleteExperiencePhotoService";

export default class ExpPhotosController {
  public async create(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const { exp_id } = request.params;
    const photo = request.file.filename;

    const addExperiencePhoto = container.resolve(AddExperiencePhotoService);

    const expPhoto = await addExperiencePhoto.execute({
      photo: photo,
      user_id: userId,
      experience_id: Number(exp_id)
    });

    return response.json(expPhoto);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const { exp_id, photo_id } = request.params;
    const photo = request.file.filename;

    const updateExperiencePhoto = container.resolve(UpdateExperiencePhotoService);

    const updatedPhoto = await updateExperiencePhoto.execute({
      photo: photo,
      user_id: userId,
      exp_id: Number(exp_id),
      photo_id: Number(photo_id)
    });

    return response.json(updatedPhoto);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const { exp_id, photo_id } = request.params;

    const deleteExperiencePhoto = container.resolve(DeleteExperiencePhotoService);

    await deleteExperiencePhoto.execute({
      user_id: userId,
      exp_id: Number(exp_id),
      photo_id: Number(photo_id)
    });

    return response.status(204).json({});
  }
}
