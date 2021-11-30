import { inject, injectable } from "tsyringe";

import AppError from "@shared/errors/AppError";

import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentsRepository";

import Experience from "../infra/typeorm/entities/Experience";

@injectable()
class ListExperiencesUserAlreadyBeenService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) {}

  public async execute(user_id: number): Promise<Experience[]> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    const appointments = await this.appointmentsRepository.findByUserId(user.id);

    const experiences = [...new Set(
      appointments.filter(a => {
        if (!a.schedule.experience.is_blocked) {
          return a;
        }
      }).map(a => { return a.schedule.experience })
    )];

    return experiences;
  }
}

export default ListExperiencesUserAlreadyBeenService;
