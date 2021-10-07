import ICreateAppBugDTO from "../dtos/ICreateAppBugDTO";
import { AppBugType } from "../infra/mongoose/schemas/AppBug";

export default interface IAppBugsRepository {
  create(data: ICreateAppBugDTO): Promise<AppBugType>;
  findAll(): Promise<AppBugType[]>;
}
