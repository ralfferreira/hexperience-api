import AppError from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

import Host from "../infra/typeorm/entities/Host";
import IHostRequestsRepository from "../repositories/IHostRequestsRepository";

import IHostsRepository from "../repositories/IHostsRepository";

interface IRequest {
  nickname: string,
  host_id: number,
}

@injectable()
class UpdateHostService {
  constructor (
    @inject('HostsRepository')
    private hostsRepository: IHostsRepository,

    @inject('HostRequestsRepository')
    private hostRequestsRepository: IHostRequestsRepository
  ) {}

  public async execute({ nickname, host_id }: IRequest): Promise<Host> {
    const host = await this.hostsRepository.findById(host_id);

    if (!host) {
      throw new AppError('Host does not exists');
    }

    const checkIfNicknameIsBeingUsed = await this.hostsRepository.findByNickname(nickname);

    if (checkIfNicknameIsBeingUsed) {
      throw new AppError('Nickname is already being used');
    }

    const checkIfNicknameIsRequested = await this.hostRequestsRepository.findByNickname(nickname);

    if (checkIfNicknameIsRequested) {
      throw new AppError('Nickname is already being used');
    }

    host.nickname = nickname;

    const updatedHost = await this.hostsRepository.update(host);

    return updatedHost;
  }
}

export default UpdateHostService
