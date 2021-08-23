import Experience from "../infra/typeorm/entities/Experience";

export default interface ICreateScheduleDTO {
  date: Date;
  max_guests: number;
  availability: number;
  experience: Experience;
}
