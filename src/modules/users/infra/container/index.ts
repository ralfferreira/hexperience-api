import { container } from "tsyringe";

import IUsersRepository from "../../repositories/IUsersRepository";
import UsersRepository from "../../infra/typeorm/repositories/UsersRepository";

import IAccountVerificationsRepository from '../../repositories/IAccountVerificationsRepository';
import AccountVerificationsRepository from '../../infra/mongoose/repositories/AccountVerificationsRepository';

import IUserTokensRepository from '../../repositories/IUserTokensRepository';
import UserTokensRepository from '../../infra/mongoose/repositories/UserTokensRepository';

import IHostRequestsRepository from '../../repositories/IHostRequestsRepository';
import HostRequestsRepository from '../../infra/mongoose/repositories/HostRequestsRepository';

import IHostsRepository from '../../repositories/IHostsRepository';
import HostsRepository from '../../infra/typeorm/repositories/HostsRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository
);

container.registerSingleton<IAccountVerificationsRepository>(
  'AccountVerificationsRepository',
  AccountVerificationsRepository
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository
);

container.registerSingleton<IHostRequestsRepository>(
  'HostRequestsRepository',
  HostRequestsRepository
);

container.registerSingleton<IHostsRepository>(
  'HostsRepository',
  HostsRepository
);
