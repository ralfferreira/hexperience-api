import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SearchForExperiencesService from '@modules/experiences/services/SearchForExperiencesService';

export default class SearchForExperiencesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const {
      is_online,
      max_duration,
      max_price,
      min_duration,
      min_price,
      name,
      parental_rating,
      categories
    } = request.body;

    const searchForExperiences = container.resolve(SearchForExperiencesService);

    const result = await searchForExperiences.execute({
      user_id: userId,
      is_online,
      max_duration,
      max_price,
      min_duration,
      min_price,
      name,
      parental_rating,
      categories
    });

    return response.json(result);
  }
}
