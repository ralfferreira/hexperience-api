import { getRepository, Repository } from "typeorm";

import Report from "../entities/Report";

import IReportsRepository from "@modules/reviews/repositories/IReportsRepository";

import ICreateReportDTO from "@modules/reviews/dtos/ICreateReportDTO";

class ReportsRepository implements IReportsRepository {
  private ormRepository: Repository<Report>

  constructor () {
    this.ormRepository = getRepository(Report);
  }

  public async create({
    comment,
    reason,
    experience,
    host,
  }: ICreateReportDTO): Promise<Report> {
    const report = await this.ormRepository.create({
      comment,
      reason
    });

    report.experience = experience;
    report.host = host

    await this.ormRepository.save(report);

    return report;
  }

  public async findById(id: number): Promise<Report | undefined> {
    const report = await this.ormRepository.findOne({
      relations: ['experience', 'host'],
      where: {
        id: id
      }
    });

    return report;
  }

  public async findAllByHostId(host_id: number): Promise<Report[]> {
    const reports = await this.ormRepository.find({
      relations: ['experience', 'host'],
      where: {
        host: {
          id: host_id
        }
      }
    });

    return reports;
  }

  public async findAllByExperienceId(exp_id: number): Promise<Report[]> {
    const reports = await this.ormRepository.find({
      relations: ['experience', 'host'],
      where: {
        experience: {
          id: exp_id
        }
      }
    });

    return reports;
  }

  public async update(report: Report): Promise<Report> {
    return this.ormRepository.save(report);
  }

}

export default ReportsRepository;
