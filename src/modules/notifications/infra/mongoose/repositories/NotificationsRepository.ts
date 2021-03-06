import { Model } from 'mongoose';

import Notifications, {
  NotificationType
} from '../schemas/Notifications';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';

import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';

class NotificationsRepository implements INotificationsRepository {
  private model: Model<NotificationType>;

  constructor () {
    this.model = Notifications;
  }

  public async create(data: ICreateNotificationDTO): Promise<NotificationType> {
    const notification = new this.model({
      title: data.title,
      message: data.message,
      receiver_id: data.receiver_id,
      exp_id: data.exp_id,
      host_id: data.host_id,
      schedule_id: data.schedule_id,
      appointment_id: data.appointment_id
    });

    await notification.save();

    return notification;
  }

  public async findAllByReceiverId(receiver_id: number): Promise<NotificationType[]> {
    const notifications = await this.model.find({
      receiver_id: receiver_id
    }).exec();

    return notifications;
  }
}

export default NotificationsRepository;
