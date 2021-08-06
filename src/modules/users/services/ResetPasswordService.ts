import { inject, injectable } from "tsyringe";

import AppError from "@shared/errors/AppError";

import IUsersRepository from "../repositories/IUsersRepository";
import IUserTokenRepository from "../repositories/IUserTokenRepository";
import IHashProvider from "../providers/HashProvider/models/IHashProvider";

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  constructor (
    @inject('UserTokenRepository')
    private userTokenRepository: IUserTokenRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({ token, password }: IRequest): Promise<void> {
    const checkToken = await this.userTokenRepository.findByToken(token);

    if (!checkToken) {
      throw new AppError('Invalid Token');
    }

    const user = await this.usersRepository.findById(checkToken.user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.update(user);

    await this.userTokenRepository.delete(checkToken.token);
  }
}

export default ResetPasswordService;