import AppError from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

import Host from "../infra/typeorm/entities/Host";
import { statusEnum } from "../infra/typeorm/entities/User";
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
      throw new AppError('Anfitrião não existe');
    }

    if (host.user.status === statusEnum.blocked) {
      throw new AppError('Host is blocked');
    }

    const checkIfNicknameIsBeingUsed = await this.hostsRepository.findByNickname(nickname);

    if (checkIfNicknameIsBeingUsed) {
      throw new AppError('Apelido já está sendo utilizado');
    }

    const checkIfNicknameIsRequested = await this.hostRequestsRepository.findByNickname(nickname);

    if (checkIfNicknameIsRequested) {
      throw new AppError('Apelido já está sendo utilizado');
    }

    host.nickname = nickname;

    const updatedHost = await this.hostsRepository.update(host);

    return updatedHost;
  }
}

export default UpdateHostService
