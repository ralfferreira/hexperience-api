import { container } from "tsyringe";

import IAdminConfigureRepository from "@modules/admin/repositories/IAdminConfigureRepository";
import AdminConfigureRepository from "../typeorm/repositories/AdminConfigureRepository";

import IAppBugsRepository from '@modules/admin/repositories/IAppBugsRepository';
import AppBugsRepository from '@modules/admin/infra/mongoose/repositories/AppBugsRepository';

container.registerSingleton<IAdminConfigureRepository>(
  'AdminConfigureRepository',
  AdminConfigureRepository
);

container.registerSingleton<IAppBugsRepository>(
  'AppBugsRepository',
  AppBugsRepository
);
