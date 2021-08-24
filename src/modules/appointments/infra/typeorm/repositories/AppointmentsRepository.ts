import { getRepository, Repository } from "typeorm";

import Appointment from "../entities/Appointment";

import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentsRepository";
import ICreateAppointmentDTO from "@modules/appointments/dtos/ICreateAppointmentDTO";

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor () {
    this.ormRepository = getRepository(Appointment);
  }

  public async create({
    final_price,
    guests,
    paid,
    schedule,
    user
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = await this.ormRepository.create({
      final_price,
      guests,
      paid,
    });

    appointment.user = user;
    appointment.schedule = schedule;

    await this.ormRepository.save(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
