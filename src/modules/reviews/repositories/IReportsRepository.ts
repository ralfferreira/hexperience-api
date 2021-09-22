import Report from "../infra/typeorm/entities/Report";
import ICreateReportDTO from "../dtos/ICreateReportDTO";

export default interface IReportsRepository {
  create(data: ICreateReportDTO): Promise<Report>;
  findById(id: number): Promise<Report | undefined>;
  update(report: Report): Promise<Report>;
}
