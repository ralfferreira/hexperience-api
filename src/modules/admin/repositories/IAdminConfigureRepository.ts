import ICreateAdminConfigureDTO from "../dtos/ICreateAdminConfigureDTO";
import AdminConfigure from "../infra/typeorm/entities/AdminConfigure";

export default interface IAdminConfigureRepository {
  create(data: ICreateAdminConfigureDTO): Promise<AdminConfigure>;
  findLatest(): Promise<AdminConfigure | undefined>;
}
