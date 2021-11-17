import ICreateAppointmentDTO from "../dtos/ICreateAppointmentDTO";
import Appointment from "../infra/typeorm/entities/Appointment";

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByExperienceId(exp_id: number): Promise<Appointment[]>;
  findById(id: number): Promise<Appointment | undefined>;
  findByUserId(user_id: number): Promise<Appointment[]>;
  findByScheduleId(schedule_id: number): Promise<Appointment[]>;
  findByHostId(host_id: number): Promise<Appointment[]>;
  cancel(appointment: Appointment): Promise<void>;
  delete(id: number): Promise<void>;
}
