import { inject, injectable } from "tsyringe";

import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import INotificationsRepository from "@modules/notifications/repositories/INotificationsRepository";

import { NotificationType } from '@modules/notifications/infra/mongoose/schemas/Notifications';
import AppError from "@shared/errors/AppError";
import { isBefore } from "date-fns";

@injectable()
class ListAllUserNotificationsService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository
  ) {}

  public async execute(user_id: number): Promise<NotificationType[]> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Usuário não existe');
    }

    const notifications = await this.notificationsRepository.findAllByReceiverId(user.id);

    notifications.sort((a, b) => {
      if (isBefore(a.createdAt, b.createdAt)) {
        return 1;
      }

      return -1;
    });

    return notifications;
  }
}

export default ListAllUserNotificationsService;
