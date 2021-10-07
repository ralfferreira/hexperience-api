import { container } from "tsyringe";

import INotificationsRepository from "@modules/notifications/repositories/INotificationsRepository";
import NotificationsRepository from "../mongoose/repositories/NotificationsRepository";

container.registerSingleton<INotificationsRepository>(
  'NotificationsRepository',
  NotificationsRepository
);
