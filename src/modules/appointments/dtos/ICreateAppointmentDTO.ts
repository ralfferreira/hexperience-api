import Schedule from "@modules/experiences/infra/typeorm/entities/Schedule";
import User from "@modules/users/infra/typeorm/entities/User";

export default interface ICreateAppointmentDTO {
  guests: number;
  paid: boolean;
  final_price: number;
  user: User;
  schedule: Schedule;
}
