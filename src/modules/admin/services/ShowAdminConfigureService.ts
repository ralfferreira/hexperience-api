import { inject, injectable } from "tsyringe";

import AppError from "@shared/errors/AppError";

import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import IAdminConfigureRepository from "../repositories/IAdminConfigureRepository";

import AdminConfigure from "../infra/typeorm/entities/AdminConfigure";
import { typeEnum } from "@modules/users/infra/typeorm/entities/User";

@injectable()
class ShowAdminConfigureService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('AdminConfigureRepository')
    private adminConfigureRepository: IAdminConfigureRepository
  ) {}

  public async execute(user_id: number): Promise<AdminConfigure> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Usuário não existe');
    }

    if (user.type !== typeEnum.admin) {
      throw new AppError('Usuário não é administrador');
    }

    const adminConfigure = await this.adminConfigureRepository.findLatest();

    if (!adminConfigure) {
      throw new AppError('Configurações administrativas não foram encontradas');
    }

    return adminConfigure;
  }
}

export default ShowAdminConfigureService;
