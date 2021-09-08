import { inject, injectable } from "tsyringe";
import { isAfter } from "date-fns";

import AppError from "@shared/errors/AppError";

import Experience from "../infra/typeorm/entities/Experience";
import IExperiencesRepository from "../repositories/IExperiencesRepository";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";

import { typeEnum } from '@modules/users/infra/typeorm/entities/User';

interface IResponse {
  available: boolean;
  experience: Experience
}

@injectable()
class ListAllAvailableExperiencesService {
  constructor (
    @inject('ExperiencesRepository')
    private experiencesRepository: IExperiencesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(user_id: number): Promise<IResponse[]> {
    let experiences = await this.experiencesRepository.findAllAvailable();

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    experiences = experiences.filter(experience => {
      if (experience.schedules.length > 0) {
        return experience;
      }
    })

    if (user.type === typeEnum.host) {
      experiences = experiences.filter(experience => {
        if (experience.host.id !== user.host.id) {
          return experience;
        }
      });
    }

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
        experience: experience
      } as IResponse;
    });

    return result;
  }
}

export default ListAllAvailableExperiencesService;
