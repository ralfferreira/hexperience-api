import { Request, Response } from "express";
import { container } from "tsyringe";

import ListAllUserNotificationsService from "@modules/notifications/services/ListAllUserNotificationsService";

export default class NotificationsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const listAllUserNotifications = container.resolve(ListAllUserNotificationsService);

    const notifications = await listAllUserNotifications.execute(userId);

    return response.json(notifications);
  }
}
