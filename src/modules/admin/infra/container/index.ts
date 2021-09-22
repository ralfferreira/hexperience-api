import { container } from "tsyringe";

import IAdminConfigureRepository from "@modules/admin/repositories/IAdminConfigureRepository";
import AdminConfigureRepository from "../typeorm/repositories/AdminConfigureRepository";

container.registerSingleton<IAdminConfigureRepository>(
  'AdminConfigureRepository',
  AdminConfigureRepository
);
