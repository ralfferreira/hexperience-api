import { inject, injectable } from "tsyringe";

import AppError from "@shared/errors/AppError";

import Appointment from "../infra/typeorm/entities/Appointment";

import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import IAppointmentsRepository from "../repositories/IAppointmentsRepository";
import isAfter from "date-fns/isAfter";

interface IRequest {
  id: number
}

@injectable()
class ListUserAppointmentsService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) {}

  public async execute({ id }: IRequest): Promise<Appointment[]> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    const appointments = await this.appointmentsRepository.findByUserId(user.id);

    return appointments;
  }
}

export default ListUserAppointmentsService;
