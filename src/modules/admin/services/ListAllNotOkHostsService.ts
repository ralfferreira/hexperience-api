import { inject, injectable } from "tsyringe";

import IUsersRepository from "@modules/users/repositories/IUsersRepository";

import User, { typeEnum } from "@modules/users/infra/typeorm/entities/User";
import AppError from "@shared/errors/AppError";

@injectable()
class ListAllNotOkHostsService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute(user_id: number): Promise<User[]> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    if (user.type !== typeEnum.admin) {
      throw new AppError('User is not an admin');
    }

    const notOkUsers = await this.usersRepository.findAllNotOkUsers();

    return notOkUsers;
  }
}

export default ListAllNotOkHostsService;
