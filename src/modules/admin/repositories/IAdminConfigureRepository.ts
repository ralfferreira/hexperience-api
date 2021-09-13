import ICreateAdminConfigure from "../dtos/ICreateAdminConfigure";
import AdminConfigure from "../infra/typeorm/entities/AdminConfigure";

export default interface IAdminConfigureRepository {
  create(data: ICreateAdminConfigure): Promise<AdminConfigure>;
  findLatest(): Promise<AdminConfigure | undefined>;
}
