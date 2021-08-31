import ICreateScheduleDTO from "../dtos/ICreateScheduleDTO";
import Schedule from "../infra/typeorm/entities/Schedule";

export default interface ISchedulesRepository {
  create(data: ICreateScheduleDTO): Promise<Schedule>;
  findById(id: number): Promise<Schedule | undefined>;
  update(schedule: Schedule): Promise<Schedule>;
  delete(id: number): Promise<void>;
}
