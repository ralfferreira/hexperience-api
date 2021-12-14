import { getRepository, Repository } from "typeorm";

import Appointment from "../entities/Appointment";

import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentsRepository";
import ICreateAppointmentDTO from "@modules/appointments/dtos/ICreateAppointmentDTO";

import { statusEnum } from '../entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor () {
    this.ormRepository = getRepository(Appointment, global.env.RDB_CONNECTION);
  }

  public async create({
    final_price,
    guests,
    status,
    schedule,
    user
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = await this.ormRepository.create({
      final_price,
      guests,
      status
    });

    appointment.user = user;
    appointment.schedule = schedule;

    await this.ormRepository.save(appointment);

    return appointment;
  }

  public async findByExperienceId(exp_id: number): Promise<Appointment[]> {
    const appointments = await this.ormRepository.find({
      relations: [
        'user',
        'schedule',
        'schedule.experience',
        'schedule.experience.host',
        'schedule.experience.reviews'
      ],
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
      relations: [
        'user',
        'schedule',
        'schedule.experience',
        'schedule.experience.host',
        'schedule.experience.reviews'
      ],
      where: {
        id: id
      }
    });

    return appointment;
  }

  public async findByUserId(user_id: number): Promise<Appointment[]> {
    const appointments = await this.ormRepository.find({
      relations: [
        'user',
        'schedule',
        'schedule.experience',
        'schedule.experience.host',
        'schedule.experience.reviews'
      ],
      where: {
        user: {
          id: user_id
        }
      }
    });

    return appointments;
  }

  public async findByScheduleId(schedule_id: number): Promise<Appointment[]> {
    const appointments = await this.ormRepository.find({
      relations: [
        'user',
        'schedule',
        'schedule.experience',
        'schedule.experience.host',
        'schedule.experience.reviews'
      ],
      where: {
        schedule: {
          id: schedule_id
        }
      }
    });

    return appointments;
  }

  public async findByHostId(host_id: number): Promise<Appointment[]> {
    const appointments = await this.ormRepository.find({
      relations: [
        'user',
        'schedule',
        'schedule.experience',
        'schedule.experience.host',
        'schedule.experience.reviews'
      ],
      where: {
        schedule: {
          experience: {
            host: {
              id: host_id
            }
          }
        }
      }
    });

    return appointments;
  }

  public async cancel(appointment: Appointment): Promise<void> {
    await this.ormRepository.save(appointment);

    await this.ormRepository.softDelete({ id: appointment.id });
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete({
      id: id
    });
  }
}

export default AppointmentsRepository;
