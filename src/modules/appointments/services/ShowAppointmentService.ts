import { inject, injectable } from "tsyringe";

import AppError from "@shared/errors/AppError";

import Appointment from "../infra/typeorm/entities/Appointment";

import IAppointmentsRepository from "../repositories/IAppointmentsRepository";
import IExperiencesRepository from '@modules/experiences/repositories/IExperiencesRepository';

interface IRequest {
  appointment_id: number,
  user_id: number,
  host_id: number,
}

@injectable()
class ShowAppointmentService {
  constructor (
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('ExperiencesRepository')
    private experiencesRepository: IExperiencesRepository
  ) {}

  public async execute({ appointment_id, host_id, user_id }: IRequest): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findById(appointment_id);

    if (!appointment) {
      throw new AppError('Appointment does not exists');
    }

    const experience = await this.experiencesRepository.findById(appointment.schedule.experience.id);

    if (!experience) {
      throw new AppError('Experience does not exists');
    }

    if (
      experience.host.id !== host_id
      && appointment.user.id !== user_id
    ) {
      throw new AppError('You have no relationship with this appointment');
    }

    return appointment;
  }
}

export default ShowAppointmentService;
