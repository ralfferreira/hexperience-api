import Experience from "@modules/experiences/infra/typeorm/entities/Experience";
import Host from "@modules/users/infra/typeorm/entities/Host";

export default interface ICreateReportDTO {
  comment: string;
  reason: string;
  experience: Experience;
  host: Host;
}
