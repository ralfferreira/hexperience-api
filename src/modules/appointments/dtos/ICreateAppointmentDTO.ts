import Schedule from "@modules/experiences/infra/typeorm/entities/Schedule";
import User from "@modules/users/infra/typeorm/entities/User";

import { statusEnum } from "../infra/typeorm/entities/Appointment";

export default interface ICreateAppointmentDTO {
  guests: number;
  status: statusEnum
  final_price: number;
  user: User;
  schedule: Schedule;
}
