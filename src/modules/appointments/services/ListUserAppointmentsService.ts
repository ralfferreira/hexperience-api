import { inject, injectable } from "tsyringe";
import { isBefore } from "date-fns";

import AppError from "@shared/errors/AppError";

import Appointment from "../infra/typeorm/entities/Appointment";

import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import IAppointmentsRepository from "../repositories/IAppointmentsRepository";
import { typeEnum } from "@modules/users/infra/typeorm/entities/User";

interface IResponse {
  isHost: boolean;
  appointment: Appointment
}

@injectable()
class ListUserAppointmentsService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) {}

  public async execute(user_id: number): Promise<IResponse[]> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    let appointments = await this.appointmentsRepository.findByUserId(user.id);

    if (user.type === typeEnum.host) {
      const hostAppointments = await this.appointmentsRepository.findByHostId(user.host.id);

      appointments.push(...hostAppointments);
    }

    appointments.sort((a, b) => {
      if (isBefore(a.schedule.date, b.schedule.date)) {
        return -1;
      }

      return 1;
    });

    const result = appointments.map(appointment => {
      let isHost = true;

      if (appointment.user.id === user.id) {
        isHost = false;
      }

      return {
        isHost,
        appointment
      }
    });

    return result;
  }
}

export default ListUserAppointmentsService;
