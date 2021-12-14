import { inject, injectable } from "tsyringe";

import AppError from "@shared/errors/AppError";

import IUsersRepository from "../repositories/IUsersRepository";
import IUserTokensRepository from "../repositories/IUserTokensRepository";
import IHashProvider from "../providers/HashProvider/models/IHashProvider";

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  constructor (
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({ token, password }: IRequest): Promise<void> {
    const checkToken = await this.userTokensRepository.findByToken(token);

    if (!checkToken) {
      throw new AppError('Token não existe ou expirou');
    }

    const user = await this.usersRepository.findById(checkToken.user_id);

    if (!user) {
      throw new AppError('Usuário não existe');
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.update(user);

    await this.userTokensRepository.delete(checkToken.token);
  }
}

export default ResetPasswordService;
