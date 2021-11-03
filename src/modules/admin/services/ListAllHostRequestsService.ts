import { inject, injectable } from "tsyringe";

import AppError from "@shared/errors/AppError";

import { HostRequestType } from "@modules/users/infra/mongoose/schemas/HostRequests";
import User, { typeEnum } from "@modules/users/infra/typeorm/entities/User";

import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import IHostRequestsRepository from "@modules/users/repositories/IHostRequestsRepository";
import { classToClass } from "class-transformer";

interface IResponse {
  request: HostRequestType,
  user: User
}

@injectable()
class ListAllHostRequestsService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HostRequestsRepository')
    private hostRequestsRepository:IHostRequestsRepository
  ) {}

  public async execute(user_id: number): Promise<IResponse[]> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    if (user.type !== typeEnum.admin) {
      throw new AppError('Only admins can do this');
    }

    const hostRequests = await this.hostRequestsRepository.findAll();

    let result: IResponse[] = [];

    for (const request of hostRequests) {
      const requester = await this.usersRepository.findById(Number(request.user_id));

      if (requester) {
        result.push({ request: request, user: classToClass(requester) })
      }
    }

    return result;
  }
}

export default ListAllHostRequestsService;
