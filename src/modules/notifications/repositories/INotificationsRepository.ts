import ICreateNotificationDTO from '../dtos/ICreateNotificationDTO';
import {
  Notifications as NotificationsType
} from '../infra/mongoose/schemas/Notifications';

export default interface INotificationsRepository {
  create(data: ICreateNotificationDTO): Promise<NotificationsType>;
  findAllByReceiverId(receiver_id: number): Promise<NotificationsType[]>;
}
