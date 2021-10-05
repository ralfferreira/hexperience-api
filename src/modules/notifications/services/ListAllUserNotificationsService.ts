import { inject, injectable } from "tsyringe";

import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import INotificationsRepository from "@modules/notifications/repositories/INotificationsRepository";

import { Notifications as NotificationType } from '@modules/notifications/infra/mongoose/schemas/Notifications';
import AppError from "@shared/errors/AppError";

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
      throw new AppError('User does not exists');
    }

    const notifications = await this.notificationsRepository.findAllByReceiverId(user.id);

    return notifications;
  }
}

export default ListAllUserNotificationsService;
