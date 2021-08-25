import { container } from "tsyringe";

import '@modules/users/providers';
import './providers';

import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import UsersRepository from "@modules/users/infra/typeorm/repositories/UsersRepository";

import IAccountVerificationsRepository from '@modules/users/repositories/IAccountVerificationsRepository';
import AccountVerificationsRepository from '@modules/users/infra/mongoose/repositories/AccountVerificationsRepository';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserTokensRepository from '@modules/users/infra/mongoose/repositories/UserTokensRepository';

import IHostRequestsRepository from '@modules/users/repositories/IHostRequestsRepository';
import HostRequestsRepository from '@modules/users/infra/mongoose/repositories/HostRequestsRepository';

import IHostsRepository from '@modules/users/repositories/IHostsRepository';
import HostsRepository from '@modules/users/infra/typeorm/repositories/HostsRepository';

import IExperiencesRepository from '@modules/experiences/repositories/IExperiencesRepository';
import ExperiencesRepository from '@modules/experiences/infra/typeorm/repositories/ExperiencesRepository';

import ISchedulesRepository from '@modules/experiences/repositories/ISchedulesRepository';
import SchedulesRepository from '@modules/experiences/infra/typeorm/repositories/SchedulesRepository';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository
)

container.registerSingleton<IAccountVerificationsRepository>(
  'AccountVerificationsRepository',
  AccountVerificationsRepository
)

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository
)

container.registerSingleton<IHostRequestsRepository>(
  'HostRequestsRepository',
  HostRequestsRepository
);

container.registerSingleton<IHostsRepository>(
  'HostsRepository',
  HostsRepository
)

container.registerSingleton<IExperiencesRepository>(
  'ExperiencesRepository',
  ExperiencesRepository
)

container.registerSingleton<ISchedulesRepository>(
  'SchedulesRepository',
  SchedulesRepository
)

container.registerSingleton<IAppointmentsRepository>(
  'AppointmentsRepository',
  AppointmentsRepository
)
