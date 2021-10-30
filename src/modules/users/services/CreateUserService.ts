import { inject, injectable } from 'tsyringe'

import AppError from '@shared/errors/AppError';

import ICreateUserDTO from "../dtos/ICreateUserDTO";
import IUsersRepository from "../repositories/IUsersRepository";
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import User from "../infra/typeorm/entities/User";
import IAccountVerificationsRepository from '../repositories/IAccountVerificationsRepository';

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('AccountVerificationsRepository')
    private accountVerificationsRepository: IAccountVerificationsRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ name, email, password, phone_number }: ICreateUserDTO): Promise<User>{
    const checkUserExists = await this.usersRepository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError('Email address already used!');
    }

    const checkAccounts = await this.accountVerificationsRepository.findByEmail(email);

    if (checkAccounts) {
      throw new AppError('Email is already been used!');
    }

    const hashedPassword = await this.hashProvider.generateHash(password)

    const user = await this.usersRepository.create({ name, email, password: hashedPassword, phone_number });

    return user;
  }
}

export default CreateUserService
