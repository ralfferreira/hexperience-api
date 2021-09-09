import { inject, injectable } from "tsyringe";
import { isAfter } from "date-fns";
import { classToClass } from "class-transformer";

import Experience from "../infra/typeorm/entities/Experience";
import IExperiencesRepository from "../repositories/IExperiencesRepository";
import IHostsRepository from "@modules/users/repositories/IHostsRepository";

import ISearchForExperienceDTO from "../dtos/ISearchForExperienceDTO";

interface IRequest extends ISearchForExperienceDTO {
  user_id: number;
}

interface IResponse {
  available: boolean;
  experience: Experience
}

@injectable()
class ListAllAvailableExperiencesService {
  constructor (
    @inject('ExperiencesRepository')
    private experiencesRepository: IExperiencesRepository,

    @inject('HostsRepository')
    private hostsRepository: IHostsRepository,
  ) {}

  public async execute({
    user_id,
    name,
    is_online,
    max_duration,
    max_price,
    min_duration,
    min_price,
    parental_rating
  }: IRequest): Promise<IResponse[]> {
    const host = await this.hostsRepository.findByUserId(user_id);

    const options = {} as ISearchForExperienceDTO;

    if (host) {
      options.host_id = host.id;
    }

    Object.assign(options, {
      is_online,
      max_duration,
      max_price,
      min_duration,
      min_price,
      parental_rating,
      name
    } as ISearchForExperienceDTO)

    let experiences = await this.experiencesRepository.findAllAvailable(options);

    const result = experiences.map(experience => {
      let isAvailable = false;

      for (const schedule of experience.schedules) {
        if (isAfter(schedule.date, new Date())) {
          if (schedule.availability > 0) {
            isAvailable = true;
          }
        }
      }

      return {
        available: isAvailable,
        experience: classToClass(experience)
      } as IResponse;
    });

    result.sort((a, b) => {
      const aRating = a.experience.getRating();
      const bRating = b.experience.getRating();

      if (aRating > bRating) {
        return -1;
      }

      return 1;
    });

    return result;
  }
}

export default ListAllAvailableExperiencesService;
