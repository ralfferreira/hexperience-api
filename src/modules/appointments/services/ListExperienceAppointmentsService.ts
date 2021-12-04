import { inject, injectable } from "tsyringe";
import { isBefore } from "date-fns";

import AppError from "@shared/errors/AppError";

import IExperiencesRepository from "@modules/experiences/repositories/IExperiencesRepository";
import IAppointmentsRepository from "../repositories/IAppointmentsRepository";

import Appointment from "../infra/typeorm/entities/Appointment";

@injectable()
class ListExperienceAppointmentsService {
  constructor (
    @inject('ExperiencesRepository')
    private experiencesRepository: IExperiencesRepository,

    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) {}

  public async execute(exp_id: number): Promise<Appointment[]> {
    const experience = await this.experiencesRepository.findById(exp_id);

    if (!experience) {
      throw new AppError('Experiência não existe')
    }

    const appointments = await this.appointmentsRepository.findByExperienceId(exp_id);

    appointments.sort((a, b) => {
      if (isBefore(a.schedule.date, b.schedule.date)) {
        return 1;
      }

      return -1;
    });

    return appointments;
  }
}

export default ListExperienceAppointmentsService;
