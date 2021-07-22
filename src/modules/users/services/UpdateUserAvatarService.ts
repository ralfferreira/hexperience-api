import { injectable, inject } from 'tsyringe';

import User from '../infra/typeorm/entities/User';
import UsersRepository from '../infra/typeorm/repositories/UsersRepository';

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository
  ) {}

  public async execute(): Promise<User> {
    return {} as User;
  }
}

export default UpdateUserAvatarService;
