import { getRepository, Repository } from "typeorm";

import IAdminConfigureRepository from "@modules/admin/repositories/IAdminConfigureRepository";

import AdminConfigure from "../entities/AdminConfigure";
import ICreateAdminConfigureDTO from "@modules/admin/dtos/ICreateAdminConfigureDTO";

class AdminConfigureRepository implements IAdminConfigureRepository {
  private ormRepository: Repository<AdminConfigure>;

  constructor () {
    this.ormRepository = getRepository(AdminConfigure, global.env.RDB_CONNECTION);
  }

  public async create({
    days_blocked,
    reports_to_block
  }: ICreateAdminConfigureDTO): Promise<AdminConfigure> {
    const adminConfigure = await this.ormRepository.create({
      days_blocked,
      reports_to_block
    });

    await this.ormRepository.save(adminConfigure);

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
