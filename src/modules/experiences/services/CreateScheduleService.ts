import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe'
import IRequestCreateScheduleDTO from '../dtos/IRequestCreateScheduleDTO';
import Schedule from '../infra/typeorm/entities/Schedule';
import IExperiencesRepository from '../repositories/IExperiencesRepository';
import ISchedulesRepository from '../repositories/ISchedulesRepository';


@injectable()
class CreateScheduleService {
  constructor(
    @inject('SchedulesRepository')
    private schedulesRepository: ISchedulesRepository,

    @inject('ExperiencesRepository')
    private experiencesRepository: IExperiencesRepository,

  ) {}

  public async execute({ date, max_guests, experience_id, host_id }: IRequestCreateScheduleDTO): Promise<Schedule>{

    const experience = await this.experiencesRepository.findById(experience_id);

    if(!experience){
        throw new AppError('Experience does not exist', 400);
    }

    if(experience.host.id !== host_id){
        throw new AppError('Host does not own this experience');
    }


    const schedule = await this.schedulesRepository.create({ date, max_guests, experience, availability: max_guests });

    return schedule;
  }
}

export default CreateScheduleService