import { getRepository, Repository } from "typeorm";

import Experience from "../entities/Experience";

import IExperiencesRepository from '@modules/experiences/repositories/IExperiencesRepository';
import ICreateExperienceDTO from "@modules/experiences/dtos/ICreateExperienceDTO";

class ExperiencesRepository implements IExperiencesRepository {
  private ormRepository: Repository<Experience>;

  constructor() {
    this.ormRepository = getRepository(Experience);
  }

  public async create({
    address,
    description,
    duration,
    host,
    is_online,
    latitude,
    longitude,
    name,
    parental_rating,
    price,
    requirements
  }: ICreateExperienceDTO): Promise<Experience> {
    const experience = await this.ormRepository.create({
      address,
      description,
      duration,
      is_online,
      latitude,
      longitude,
      name,
      parental_rating,
      price,
      requirements,
      is_blocked: false
    });

    experience.host = host;

    await this.ormRepository.save(experience);

    return experience;
  }

  public async findById(id: number): Promise<Experience | undefined> {
    const experience = await this.ormRepository.findOne({
      relations: ['host', 'schedules'],
      where: {
        id: id
      }
    });

    return experience;
  }

  public async update(experience: Experience): Promise<Experience> {
    return this.ormRepository.save(experience);
  }
}

export default ExperiencesRepository;
