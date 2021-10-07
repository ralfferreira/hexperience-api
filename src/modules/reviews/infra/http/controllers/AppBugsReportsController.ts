import { Request, Response } from "express";
import { container } from "tsyringe";

import ReportAppBugService from "@modules/reviews/services/ReportAppBugService";

export default class AppBugsReportsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const { what, where, description } = request.body;

    const reportAppBug = container.resolve(ReportAppBugService);

    const appBug = await reportAppBug.execute({
      what,
      where,
      description,
      user_id: userId
    });

    return response.json(appBug);
  }
}
