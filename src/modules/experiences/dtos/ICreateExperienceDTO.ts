import Host from "@modules/users/infra/typeorm/entities/Host";
import Category from "../infra/typeorm/entities/Category";

export default interface ICreateExperienceDTO {
  name: string;
  duration: number;
  description: string;
  price: number;
  requirements: string;
  parental_rating: number;
  max_guests: number;
  address: string;
  latitude: number;
  longitude: number;
  is_online: boolean;
  host: Host;
  category: Category;
}
