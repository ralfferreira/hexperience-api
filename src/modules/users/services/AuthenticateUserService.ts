import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import User, { statusEnum, typeEnum } from '../infra/typeorm/entities/User';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(password, user.password);

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    if (user.status === statusEnum.blocked) {
      throw new AppError('User is blocked, so it can not authenticate');
    }

    let hostId = 0;

    if (user.type === typeEnum.host) {
      hostId = user.host.id
    }

    const secret = authConfig.jwt.secret;

    const token = sign({
      hostId,
      type: user.type
    }, secret, {
      subject: `${user.id}`,
      expiresIn: '1d'
    })

    return { user, token };
  }
}

export default AuthenticateUserService;
