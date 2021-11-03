import { Request, Response } from "express";
import { container } from "tsyringe";
import { classToClass } from "class-transformer";

import ListAllExperienceReviewsService from "@modules/reviews/services/ListAllExperienceReviewsService";

export default class ExperiencesReviewsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { exp_id } = request.params;

    const listAllExperienceReviews = container.resolve(ListAllExperienceReviewsService);

    const reviews = await listAllExperienceReviews.execute(Number(exp_id));

    return response.json(classToClass(reviews));
  }
}
