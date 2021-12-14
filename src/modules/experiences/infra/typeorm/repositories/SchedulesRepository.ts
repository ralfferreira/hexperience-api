import { getRepository, Repository } from "typeorm";

import Schedule from "../entities/Schedule";

import ISchedulesRepository from "@modules/experiences/repositories/ISchedulesRepository";
import ICreateScheduleDTO from "@modules/experiences/dtos/ICreateScheduleDTO";

class SchedulesRepository implements ISchedulesRepository {
  private ormRepository: Repository<Schedule>;

  constructor() {
    this.ormRepository = getRepository(Schedule, global.env.RDB_CONNECTION);
  }

  public async create({ date, availability, experience }: ICreateScheduleDTO): Promise<Schedule> {
    const schedule = await this.ormRepository.create({
      date,
      availability
    });

    schedule.experience = experience;

    await this.ormRepository.save(schedule);

    return schedule;
  }

  public async findById(id: number): Promise<Schedule | undefined> {
    const schedule = await this.ormRepository.findOne({
      relations: ['experience', 'experience.host', 'experience.reviews'],
      where: {
        id: id
      }
    });

    return schedule;
  }

  public async update(schedule: Schedule): Promise<Schedule> {
    const updatedSchedule = await this.ormRepository.save(schedule);

    return updatedSchedule;
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete({
      id: id
    });
  }
}

export default SchedulesRepository;
