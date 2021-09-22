import { container } from "tsyringe";

import IExperiencesRepository from '@modules/experiences/repositories/IExperiencesRepository';
import ExperiencesRepository from '@modules/experiences/infra/typeorm/repositories/ExperiencesRepository';

import ISchedulesRepository from '@modules/experiences/repositories/ISchedulesRepository';
import SchedulesRepository from '@modules/experiences/infra/typeorm/repositories/SchedulesRepository';

import ICategoriesRepository from '@modules/experiences/repositories/ICategoriesRepository';
import CategoriesRepository from '@modules/experiences/infra/typeorm/repositories/CategoriesRepository';

import IExpPhotosRepository from "@modules/experiences/repositories/IExpPhotosRepository";
import ExpPhotosRepository from "../typeorm/repositories/ExpPhotosRepository";

container.registerSingleton<IExperiencesRepository>(
  'ExperiencesRepository',
  ExperiencesRepository
);

container.registerSingleton<ISchedulesRepository>(
  'SchedulesRepository',
  SchedulesRepository
);

container.registerSingleton<ICategoriesRepository>(
  'CategoriesRepository',
  CategoriesRepository
);

container.registerSingleton<IExpPhotosRepository>(
  'ExpPhotosRepository',
  ExpPhotosRepository
);
