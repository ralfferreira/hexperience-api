import ICreateNotificationDTO from '../dtos/ICreateNotificationDTO';
import {
  NotificationType
} from '../infra/mongoose/schemas/Notifications';

export default interface INotificationsRepository {
  create(data: ICreateNotificationDTO): Promise<NotificationType>;
  findAllByReceiverId(receiver_id: number): Promise<NotificationType[]>;
}
