import ICreateExperienceDTO from "../dtos/ICreateExperienceDTO";
import ISearchForExperienceDTO from "../dtos/ISearchForExperienceDTO";
import Experience from "../infra/typeorm/entities/Experience";

export default interface IExperiencesRepository {
  create(data: ICreateExperienceDTO): Promise<Experience>;
  findById(id: number): Promise<Experience | undefined>;
  update(experience: Experience): Promise<Experience>;
  findAllAvailable(options: ISearchForExperienceDTO): Promise<Experience[]>;
}
