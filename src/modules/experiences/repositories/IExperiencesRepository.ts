import ICreateExperienceDTO from "../dtos/ICreateExperienceDTO";
import ISearchForExperienceDTO from "../dtos/ISearchForExperienceDTO";
import Experience from "../infra/typeorm/entities/Experience";

export default interface IExperiencesRepository {
  create(data: ICreateExperienceDTO): Promise<Experience>;
  findById(id: number): Promise<Experience | undefined>;
  findAllAvailable(options: ISearchForExperienceDTO): Promise<Experience[]>;
  findByHostId(host_id: number): Promise<Experience[]>
  update(experience: Experience): Promise<Experience>;
  findAllReported(): Promise<Experience[]>;
  delete(id: number): Promise<void>;
}
