import { inject, injectable } from "tsyringe";

import AppError from "@shared/errors/AppError";

import Experience from "../infra/typeorm/entities/Experience";

import IExperiencesRepository from "../repositories/IExperiencesRepository";

interface IRequest {
  id: number;
  name: string;
  duration: number;
  description: string;
  price: number;
  requirements: string;
  parental_rating: number;
  address: string;
  latitude: number;
  longitude: number;
  is_online: boolean;
  host_id: number;
}

@injectable()
class UpdateExperienceService {
  constructor (
    @inject('ExperiencesRepository')
    private experiencesRepository: IExperiencesRepository
  ) {}

  public async execute({
    id,
    host_id,
    address,
    description,
    duration,
    is_online,
    latitude,
    longitude,
    name,
    parental_rating,
    price,
    requirements
  }: IRequest): Promise<Experience> {
    const experience = await this.experiencesRepository.findById(id);

    if (!experience) {
      throw new AppError('Experience does not exists');
    }

    if (experience.host.id !== host_id) {
      throw new AppError('Host does not own this experience');
    }

    if (experience.is_blocked) {
      throw new AppError('You can not update a blocked experience');
    }

    if (duration > 360) {
      throw new AppError('Experience can not last more than 6 hours');
    }

    // still need to implement notification, so when an experience is updated,
    // we need to inform users who have scheduled a time that there have been
    // changes in the experience.

    experience.name = name;
    experience.duration = duration;
    experience.description = description;
    experience.price = price;
    experience.requirements = requirements;
    experience.parental_rating = parental_rating;
    experience.address = address;
    experience.latitude = latitude;
    experience.longitude = longitude;
    experience.is_online = is_online;

    const updatedExperience = await this.experiencesRepository.update(experience);

    return updatedExperience;
  }
}

export default UpdateExperienceService;
