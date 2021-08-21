import ICreateExperienceDTO from "@modules/experiences/dtos/ICreateExperienceDTO";
import { getRepository, Repository } from "typeorm";
import Experience from "../entities/Experience";
import IExperiencesRepository from '@modules/experiences/repositories/IExperiencesRepository';


class ExperiencesRepository implements IExperiencesRepository {
  private ormRepository: Repository<Experience>;

  constructor() {
    this.ormRepository = getRepository(Experience);
  }


  public async create(experienceData: ICreateExperienceDTO): Promise<Experience> {
    const experience = this.ormRepository.create(experienceData);

    await this.ormRepository.save(experience);

    return experience;
  }

}

export default ExperiencesRepository;
