import Experience from "@modules/experiences/infra/typeorm/entities/Experience";
import Host from "@modules/users/infra/typeorm/entities/Host";
import User from "@modules/users/infra/typeorm/entities/User";

export default interface ICreateReviewDTO {
  comment: string;
  rating: number;
  user: User;
  experience: Experience;
  host: Host;
}
