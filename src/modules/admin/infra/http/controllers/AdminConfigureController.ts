import { Request, Response } from "express";
import { container } from "tsyringe";

import UpdateAdminConfigureService from "@modules/admin/services/UpdateAdminConfigureService";

export default class AdminConfigureController {
  public async update(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const { days_blocked, reports_to_block } = request.body;

    const updateAdminConfigure = container.resolve(UpdateAdminConfigureService);

    const newConfigure = await updateAdminConfigure.execute({
      days_blocked,
      reports_to_block,
      user_id: userId
    });

    return response.json(newConfigure);
  }
}
