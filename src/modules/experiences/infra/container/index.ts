import { container } from "tsyringe";

import IExperiencesRepository from '@modules/experiences/repositories/IExperiencesRepository';
import ExperiencesRepository from '@modules/experiences/infra/typeorm/repositories/ExperiencesRepository';

import ISchedulesRepository from '@modules/experiences/repositories/ISchedulesRepository';
import SchedulesRepository from '@modules/experiences/infra/typeorm/repositories/SchedulesRepository';

container.registerSingleton<IExperiencesRepository>(
  'ExperiencesRepository',
  ExperiencesRepository
);

container.registerSingleton<ISchedulesRepository>(
  'SchedulesRepository',
  SchedulesRepository
);
