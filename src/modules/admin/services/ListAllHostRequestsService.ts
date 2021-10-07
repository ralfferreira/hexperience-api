import { inject, injectable } from "tsyringe";

import AppError from "@shared/errors/AppError";

import { HostRequestType } from "@modules/users/infra/mongoose/schemas/HostRequests";
import { typeEnum } from "@modules/users/infra/typeorm/entities/User";

import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import IHostRequestsRepository from "@modules/users/repositories/IHostRequestsRepository";

@injectable()
class ListAllHostRequestsService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HostRequestsRepository')
    private hostRequestsRepository:IHostRequestsRepository
  ) {}

  public async execute(user_id: number): Promise<HostRequestType[]> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    if (user.type !== typeEnum.admin) {
      throw new AppError('Only admins can do this');
    }

    const hostRequests = await this.hostRequestsRepository.findAll();

    return hostRequests;
  }
}

export default ListAllHostRequestsService;
