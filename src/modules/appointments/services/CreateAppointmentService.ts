import { inject, injectable } from "tsyringe";

import AppError from "@shared/errors/AppError";

import Appointment from "../infra/typeorm/entities/Appointment";

import ISchedulesRepository from "@modules/experiences/repositories/ISchedulesRepository";
import IAppointmentsRepository from "../repositories/IAppointmentsRepository";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import IHostsRepository from "@modules/users/repositories/IHostsRepository";

interface IRequest {
  guests: number;
  paid: boolean;
  user_id: number;
  schedule_id: number;
}

@injectable()
class CreateAppointmentService {
  constructor (
    @inject('SchedulesRepository')
    private schedulesRepository: ISchedulesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HostsRepository')
    private hotstsRepository: IHostsRepository,

    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) {}

  public async execute({
    guests,
    paid,
    schedule_id,
    user_id
  }: IRequest): Promise<Appointment> {
    const schedule = await this.schedulesRepository.findById(schedule_id);

    if (!schedule) {
      throw new AppError('Schedule does not exists');
    }

    if (schedule.experience.is_blocked) {
      throw new AppError('Blocked experiences can not receive new appointments')
    }

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    const host = await this.hotstsRepository.findById(schedule.experience.host.id);

    if (!host) {
      throw new AppError('Host does not exists');
    }

    if (user.id === host.user.id) {
      throw new AppError('You can not make an appointment in your own experience');
    }

    if (guests > schedule.availability) {
      throw new AppError('Schedule does not have availability for this number of guests')
    }

    schedule.availability -= guests;

    const updatedSchedule = await this.schedulesRepository.update(schedule);

    const finalPrice = guests * schedule.experience.price;

    const appointment = await this.appointmentsRepository.create({
      final_price: finalPrice,
      guests,
      paid,
      schedule: updatedSchedule,
      user: user
    });

    // Still need to notify the host that an appointment has been made

    return appointment;
  }
}

export default CreateAppointmentService;
