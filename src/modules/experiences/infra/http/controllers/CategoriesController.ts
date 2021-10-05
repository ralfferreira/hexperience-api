import { Request, Response } from "express";
import { container } from "tsyringe";

import ListAllAvailableCategoriesService from "@modules/experiences/services/ListAllAvailableCategoriesService";

export default class CategoriesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listAllAvailableCategories = container.resolve(ListAllAvailableCategoriesService);

    const categories = await listAllAvailableCategories.execute();

    return response.json(categories);
  }
}
