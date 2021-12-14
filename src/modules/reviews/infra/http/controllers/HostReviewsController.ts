import { Request, Response } from "express";
import { container } from "tsyringe";
import { classToClass } from "class-transformer";

import ListAllHostReviewsService from "@modules/reviews/services/ListAllHostReviewsService";

export default class HostReviewsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { host_id } = request.params;

    const listAllHostReviews = container.resolve(ListAllHostReviewsService);

    const reviews = await listAllHostReviews.execute(Number(host_id));

    return response.json(classToClass(reviews));
  }
}
