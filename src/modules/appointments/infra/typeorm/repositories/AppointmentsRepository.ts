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

  public async findByExperienceId(exp_id: number): Promise<Appointment[]> {
    const appointments = await this.ormRepository.find({
      relations: ['user', 'schedule', 'schedule.experience'],
      where: {
        schedule: {
          experience: {
            id: exp_id,
          }
        }
      }
    });

    return appointments
  }

  public async findById(id: number): Promise<Appointment | undefined> {
    const appointment = await this.ormRepository.findOne({
      relations: ['user', 'schedule', 'schedule.experience'],
      where: {
        id: id
      }
    });

    return appointment;
  }

  public async findByUserId(user_id: number): Promise<Appointment[]> {
    const appointments = await this.ormRepository.find({
      relations: ['user', 'schedule', 'schedule.experience'],
      where: {
        user: { id: user_id }
      }
    });
    // await this.ormRepository.query(
    //   'SELECT * FROM Appointment a ' +
    //   'LEFT JOIN `User` u ON u.id  = a.user_id ' +
    //   'LEFT JOIN Schedule s ON s.id = a.schedule_id ' +
    //   'LEFT JOIN Experience e ON e.id = s.exp_id ' +
    //   'WHERE a.user_id = ' + Number(user_id)
    // );

    return appointments;
  }
}

export default AppointmentsRepository;
