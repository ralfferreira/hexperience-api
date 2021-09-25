import Report from "../infra/typeorm/entities/Report";
import ICreateReportDTO from "../dtos/ICreateReportDTO";

export default interface IReportsRepository {
  create(data: ICreateReportDTO): Promise<Report>;
  findById(id: number): Promise<Report | undefined>;
  findAllByHostId(host_id: number): Promise<Report[]>;
  update(report: Report): Promise<Report>;
}
