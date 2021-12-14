import { Request, Response } from "express";
import { container } from "tsyringe";
import { classToClass } from "class-transformer";

import ListExperiencesUserAlreadyBeenService from "@modules/experiences/services/ListExperiencesUserAlreadyBeenService";

export default class UserExperiencesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { user_id } = request.params;

    const listExperiencesUserAlreadyBeen = container.resolve(ListExperiencesUserAlreadyBeenService);

    const experiences = await listExperiencesUserAlreadyBeen.execute(Number(user_id));

    return response.json(classToClass(experiences));
  }
}
