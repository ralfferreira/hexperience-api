import { getRepository, Repository } from "typeorm";

import IAdminConfigureRepository from "@modules/admin/repositories/IAdminConfigureRepository";

import AdminConfigure from "../entities/AdminConfigure";
import ICreateAdminConfigure from "@modules/admin/dtos/ICreateAdminConfigure";

class AdminConfigureRepository implements IAdminConfigureRepository {
  private ormRepository: Repository<AdminConfigure>;

  constructor () {
    this.ormRepository = getRepository(AdminConfigure);
  }

  public async create({
    days_blocked,
    reports_to_block
  }: ICreateAdminConfigure): Promise<AdminConfigure> {
    const adminConfigure = await this.ormRepository.create({
      days_blocked,
      reports_to_block
    });

    return adminConfigure;
  }

  public async findLatest(): Promise<AdminConfigure | undefined> {
    const adminConfigure = await this.ormRepository.findOne({
      order: {
        created_at: 'DESC'
      }
    });

    return adminConfigure;
  }
}

export default AdminConfigureRepository;
