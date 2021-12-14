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
      throw new AppError('Experiência não existe', 400);
    }

    if (experience.host.id !== host_id){
      throw new AppError('Esse anfitrião não controla essa experiência');
    }

    if (experience.is_blocked) {
      throw new AppError('Não é possível criar novos horários para agendamento para experiências bloqueadas');
    }

    if (isBefore(date, new Date())) {
      throw new AppError('Horário para agendamento não pode ocorrer numa data que já passou');
    }

    if (getHours(date) < 5 && getHours(date) > 0) {
      throw new AppError('Horários para agendamento não podem ser ocorrer entre às 00h00 e 05h00');
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
      throw new AppError('Horários para agendamento não podem ocorrer no mesmo intervalo de tempo');
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
