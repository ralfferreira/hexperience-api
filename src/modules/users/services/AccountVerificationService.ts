import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/User';

import IAccountVerificationsRepository from '../repositories/IAccountVerificationsRepository';
import IUsersRepository from '../repositories/IUsersRepository';

@injectable()
class AccountVerificationService {
  constructor (
    @inject('AccountVerificationsRepository')
    private accountVerificationsRepository: IAccountVerificationsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute(token: string): Promise<User> {
    const userData = await this.accountVerificationsRepository.findByToken(token);

    if (!userData) {
      throw new AppError('Token does not exists or is expired')
    }

    const user = await this.usersRepository.create({
      name: userData.name,
      email: userData.email,
      phone_number: userData.phone_number,
      password: userData.password
    });

    await this.accountVerificationsRepository.delete(token);

    return user;
  }
}

export default AccountVerificationService;
