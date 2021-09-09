import { getRepository, Repository } from "typeorm";

import IHostsRepository from "@modules/users/repositories/IHostsRepository";

import Host from "../entities/Host";

import ICreateHostDTO from "@modules/users/dtos/ICreateHostDTO";

class HostsRepository implements IHostsRepository {
  private ormRepository: Repository<Host>;

  constructor () {
    this.ormRepository = getRepository(Host);
  }

  public async create({ cpf, cnpj, user, nickname }: ICreateHostDTO): Promise<Host> {
    const host = await this.ormRepository.create({
      cpf,
      cnpj,
      nickname,
    });

    host.user = user;

    await this.ormRepository.save(host);

    return host;
  }

  public async findById(id: number): Promise<Host | undefined> {
    const host = await this.ormRepository.findOne({
      relations: ['user'],
      where: {
        id: id,
      }
    });

    return host;
  }

  public async findByNickname(nickname: string): Promise<Host | undefined> {
    const host = await this.ormRepository.findOne({
      relations: ['user'],
      where: {
        nickname: nickname
      }
    });

    return host;
  }

  public async update(host: Host): Promise<Host> {
    return this.ormRepository.save(host);
  }

  public async findByUserId(user_id: number): Promise<Host | undefined> {
    const host = await this.ormRepository.findOne({
      relations: ['user'],
      where: {
        user: {
          id: user_id
        }
      }
    });

    return host;
  }
}

export default HostsRepository;
