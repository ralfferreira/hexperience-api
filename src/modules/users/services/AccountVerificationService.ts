import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/User';

import IAccountVerificationRepository from '../repositories/IAccountVerificationRepository';
import IUsersRepository from '../repositories/IUsersRepository';

@injectable()
class AccountVerificationService {
  constructor (
    @inject('AccountVerificationRepository')
    private accountVerificationRepository: IAccountVerificationRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute(token: string): Promise<User> {
    const userData = await this.accountVerificationRepository.findByToken(token);

    if (!userData) {
      throw new AppError('Token does not exists or is expired')
    }

    const user = await this.usersRepository.create({
      name: userData.name,
      email: userData.email,
      password: userData.password
    });

    await this.accountVerificationRepository.delete(token);

    return user;
  }
}

export default AccountVerificationService;