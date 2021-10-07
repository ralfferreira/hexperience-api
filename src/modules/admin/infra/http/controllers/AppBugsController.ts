import { Request, Response } from "express";
import { container } from "tsyringe";

import ListAllReportedBugsService from "@modules/admin/services/ListAllReportedBugsService";

export default class AppBugsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listAllReportedBugs = container.resolve(ListAllReportedBugsService);

    const appBugs = await listAllReportedBugs.execute();

    return response.json(appBugs);
  }
}
