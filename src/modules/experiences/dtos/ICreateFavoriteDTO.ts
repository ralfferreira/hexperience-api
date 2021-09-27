import User from "@modules/users/infra/typeorm/entities/User";
import Experience from "../infra/typeorm/entities/Experience";

export default interface ICreateFavoriteDTO {
  user: User,
  experience: Experience,
  folder?: string;
}
