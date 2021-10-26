import { getRepository, Repository } from "typeorm";

import IUsersRepository from "@modules/users/repositories/IUsersRepository";

import User, { typeEnum } from '../entities/User';
import ICreateUserDTO from "@modules/users/dtos/ICreateUserDTO";

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User, global.env.RDB_CONNECTION);
  }

  public async findById(id: number): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      relations: ['host'],
      where: {
        id: id,
      }
    });

    return user;
  }

  public async findByHostId(host_id: number): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      relations: ['host'],
      where: {
        host: {
          id: host_id
        }
      }
    });

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      relations: ['host'],
      where: {
        email: email,
      }
    })

    return user;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create(userData);

    await this.ormRepository.save(user);

    return user;
  }

  public async update(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }

  public async findAllAdmins(): Promise<User[]> {
    const admins = await this.ormRepository.find({
      where: {
        type: typeEnum.admin
      }
    });

    return admins
  }
}

export default UsersRepository;
