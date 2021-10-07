import Experience from "../infra/typeorm/entities/Experience";

export default interface ICreateScheduleDTO {
  date: Date;
  availability: number;
  experience: Experience;
}
