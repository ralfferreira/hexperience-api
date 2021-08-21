import ICreateExperienceDTO from "../dtos/ICreateExperienceDTO";
import Experience from "../infra/typeorm/entities/Experience";

export default interface IExperiencesRepository {
  create(data: ICreateExperienceDTO): Promise<Experience>;
  findById(id: number): Promise<Experience | undefined>;
}