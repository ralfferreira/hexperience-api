import { inject, injectable } from 'tsyringe'

import IExperiencesRepository from '../repositories/IExperiencesRepository'
import ICreateExperienceDTO from '../dtos/ICreateExperienceDTO';
import Experience from '../infra/typeorm/entities/Experience';


@injectable()
class CreateExperienceService {
  constructor(
    @inject('ExperiencesRepository')
    private experiencesRepository: IExperiencesRepository,

  ) {}

  public async execute({ name, duration, address, description, latitude, longitude, parental_rating, price, requirements }: ICreateExperienceDTO): Promise<Experience>{

    const experience = await this.experiencesRepository.create({ name, duration, address, description, latitude, longitude, parental_rating, price, requirements });

    return experience;
  }
}

export default CreateExperienceService
