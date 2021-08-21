import CreateExperienceService from '@modules/experiences/services/CreateExperienceService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';


export default class ExperiencesController {
    public async create(request: Request, response: Response): Promise<Response> {
        const { name, duration, address, description, latitude, longitude, parental_rating, price, requirements } = request.body;

        const createExperience = container.resolve(CreateExperienceService);

        const experience = await createExperience.execute({ name, duration, address, description, latitude, longitude, parental_rating, price, requirements });
    
        return response.json(experience);
      }
    
    }