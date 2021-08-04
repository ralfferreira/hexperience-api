import { container } from "tsyringe";

import '@modules/users/providers';
import './providers';

import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import UsersRepository from "@modules/users/infra/typeorm/repositories/UsersRepository";

import IAccountVerificationRepository from '@modules/users/repositories/IAccountVerificationRepository';
import AccountVerificationRepository from '@modules/users/infra/mongoose/repositories/AccountVerificationRepository';

import IUserTokenRepository from '@modules/users/repositories/IUserTokenRepository';
import UserTokenRepository from '@modules/users/infra/mongoose/repositories/UserTokenRepository';

import IHostRequestRepository from '@modules/users/repositories/IHostRequestRepository';
import HostRequestRepository from '@modules/users/infra/mongoose/repositories/HostRequestRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository
)

container.registerSingleton<IAccountVerificationRepository>(
  'AccountVerificationRepository',
  AccountVerificationRepository
)

container.registerSingleton<IUserTokenRepository>(
  'UserTokenRepository',
  UserTokenRepository
)

container.registerSingleton<IHostRequestRepository>(
  'HostRequestRepository',
  HostRequestRepository
)
