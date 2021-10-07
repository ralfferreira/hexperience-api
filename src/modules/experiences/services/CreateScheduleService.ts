import { inject, injectable } from 'tsyringe';
import { isBefore, getHours, areIntervalsOverlapping, add, } from 'date-fns';

import AppError from '@shared/errors/AppError';

import IExperiencesRepository from '../repositories/IExperiencesRepository';
import ISchedulesRepository from '../repositories/ISchedulesRepository';

import Schedule from '../infra/typeorm/entities/Schedule';

interface IRequest {
  date: Date;
  host_id: number;
  experience_id: number;
}

@injectable()
class CreateScheduleService {
  constructor(
    @inject('SchedulesRepository')
    private schedulesRepository: ISchedulesRepository,

    @inject('ExperiencesRepository')
    private experiencesRepository: IExperiencesRepository,

  ) {}

  public async execute({
    date,
    experience_id,
    host_id
  }: IRequest): Promise<Schedule>{
    const experience = await this.experiencesRepository.findById(experience_id);

    if (!experience){
      throw new AppError('Experience does not exist', 400);
    }

    if (experience.host.id !== host_id){
      throw new AppError('Host does not own this experience');
    }

    if (experience.is_blocked) {
      throw new AppError('You can not create schedules for blocked experiences');
    }

    if (isBefore(date, new Date())) {
      throw new AppError('Schedule can not be created in a past date');
    }

    if (getHours(date) < 5 && getHours(date) > 0) {
      throw new AppError('Schedules can not be created between 12:00 AM and 5:00 AM');
    }

    const checkIfDateIsAvailable = experience.schedules.filter(scheduledDate => {
      if (
        areIntervalsOverlapping(
          { start: date, end: add(date, { minutes: experience.duration }) },
          { start: scheduledDate.date, end: add(scheduledDate.date, { minutes: experience.duration }) },
          { inclusive: true }
        )
      ) {
        return scheduledDate;
      }
    });

    if (checkIfDateIsAvailable.length) {
      throw new AppError('Schedules can not be created between the same time interval');
    }

    const schedule = await this.schedulesRepository.create({
      date,
      experience,
      availability: experience.max_guests
    });

    return schedule;
  }
}

export default CreateScheduleService;
