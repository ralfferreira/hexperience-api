import { inject, injectable } from "tsyringe";
import { classToClass } from "class-transformer";
import { isAfter } from "date-fns";

import IPointDTO from "../dtos/IPointDTO";

import IHostsRepository from "@modules/users/repositories/IHostsRepository";
import IExperiencesRepository from "../repositories/IExperiencesRepository";
import ISearchForExperienceDTO from "../dtos/ISearchForExperienceDTO";

import Experience from "../infra/typeorm/entities/Experience";
import IGeolocationProvider from "../providers/GeolocationProvider/models/IGeolocationProvider";

interface IRequest {
  user_id: number;
  currentLocation: IPointDTO;
}

interface IResponse {
  available: boolean;
  experience: Experience
}

@injectable()
class ListNearExperiencesService {
  constructor (
    @inject('ExperiencesRepository')
    private experiencesRepository: IExperiencesRepository,

    @inject('HostsRepository')
    private hostsRepository: IHostsRepository,

    @inject('GeolocationProvider')
    private geolocationProvider: IGeolocationProvider
  ) {}

  public async execute({ user_id, currentLocation }: IRequest): Promise<IResponse[]> {
    const host = await this.hostsRepository.findByUserId(user_id);

    const options = {} as ISearchForExperienceDTO;

    if (host) {
      options.host_id = host.id;
    }

    const experiences = await this.experiencesRepository.findAllAvailable(options);

    const nearExperiences = experiences.filter(experience => {
      if (experience.is_online) {
        return;
      }

      const distanceInMeters = this.geolocationProvider.distanceTo(currentLocation, {
        lat: experience.latitude,
        lon: experience.longitude
      });

      if (distanceInMeters > 10000) {
        return;
      }
      return experience;
    })

    const result = nearExperiences.map(experience => {
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

export default ListNearExperiencesService;
