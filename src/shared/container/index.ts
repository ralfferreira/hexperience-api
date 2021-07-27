import { container } from "tsyringe";

import '@modules/users/providers';
import './providers';

import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import UsersRepository from "@modules/users/infra/typeorm/repositories/UsersRepository";

import IAccountVerificationRepository from '@modules/users/repositories/IAccountVerificationRepository';
import AccountVerificationRepository from '@modules/users/infra/mongoose/repositories/AccountVerificationRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository
)

container.registerSingleton<IAccountVerificationRepository>(
  'AccountVerificationRepository',
  AccountVerificationRepository
)
