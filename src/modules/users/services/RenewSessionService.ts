import { injectable, inject } from "tsyringe";
import { differenceInDays } from "date-fns";
import { decode, sign } from "jsonwebtoken";
import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';

import IAdminConfigureRepository from "@modules/admin/repositories/IAdminConfigureRepository";
import IUsersRepository from '../repositories/IUsersRepository';
import User, { statusEnum, typeEnum } from "../infra/typeorm/entities/User";

interface IRequest {
  token: string;
  user_id: number;
}

interface ITokenPayload {
  iat: number,
  exp: number,
  sub: string,
  hostId: number,
  type: string
}

interface IResponse {
  user: User;
  newToken: string;
}

@injectable()
class RenewSessionService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('AdminConfigureRepository')
    private adminConfigureRepository: IAdminConfigureRepository
  ) {}

  public async execute({ user_id, token }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Usuário não existe');
    }

    const decoded = decode(token, { json: true });

    const { sub, type } = decoded as ITokenPayload;

    if (Number(sub) !== user.id) {
      throw new AppError('Não foi possível renovar a sessão');
    }

    if (type === 'admin') {
      throw new AppError('Admins não podem renovar sessão');
    }

    if (user.status === statusEnum.blocked) {
      const adminConfigure = await this.adminConfigureRepository.findLatest();

      if (!adminConfigure) {
        throw new AppError('Configurações administrativas não foram encontradas');
      }

      if (differenceInDays(user.updated_at, new Date()) < adminConfigure.days_blocked) {
        throw new AppError('Usuário bloqueado não pode acessar o sistema');
      }

      user.status = statusEnum.ok;

      await this.usersRepository.update(user);
    }

    let hostId = 0;

    if (user.type === typeEnum.host) {
      hostId = user.host.id
    }

    const secret = authConfig.jwt.secret;

    const newToken = sign({
      hostId,
      type: user.type
    }, secret, {
      subject: `${user.id}`,
      expiresIn: '1d'
    });

    return { user, newToken };
  }
}

export default RenewSessionService;
