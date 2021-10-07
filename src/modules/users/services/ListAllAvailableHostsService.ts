import { inject, injectable } from "tsyringe";

import AppError from "@shared/errors/AppError";

import Host from "../infra/typeorm/entities/Host";

import IHostsRepository from "../repositories/IHostsRepository";
import IUsersRepository from "../repositories/IUsersRepository";

import { typeEnum } from "../infra/typeorm/entities/User";
import ISearchForHostsDTO from "../dtos/ISearchForHostsDTO";

interface IRequest {
  user_id: number;
}

@injectable()
class ListAllAvailableHostsService {
  constructor (
    @inject('HostsRepository')
    private hostsRepository: IHostsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute({ user_id }: IRequest): Promise<Host[]> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    const options = {} as ISearchForHostsDTO;

    if (user.type === typeEnum.host) {
      options.user_id = user.id;
    }

    let hosts = await this.hostsRepository.findAll(options);

    return hosts;
  }
}

export default ListAllAvailableHostsService;
