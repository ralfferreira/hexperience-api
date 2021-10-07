import { inject, injectable } from "tsyringe";

import AppError from "@shared/errors/AppError";

import User, { statusEnum } from "../infra/typeorm/entities/User";
import IHashProvider from "../providers/HashProvider/models/IHashProvider";
import IUsersRepository from "../repositories/IUsersRepository";

interface IRequest {
  id: number,
  name: string,
  email: string,
  old_password?: string,
  password?: string,
  phone_number: string,
  bio: string,
}

@injectable()
class UpdateProfileService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    id,
    name,
    email,
    old_password,
    password,
    phone_number,
    bio
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError('User does not exists!');
    }

    if (user.status === statusEnum.blocked) {
      throw new AppError('User is blocked');
    }

    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== id) {
      throw new AppError('Email already been used!');
    }

    user.name = name;
    user.email = email;
    user.phone_number = phone_number;
    user.bio = bio;

    if (password && !old_password) {
      throw new AppError('You have to inform the old password to set a new password');
    }

    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password
      );

      if (!checkOldPassword) {
        throw new AppError('Old Password does not match');
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    return this.usersRepository.update(user);
  }
}

export default UpdateProfileService;
