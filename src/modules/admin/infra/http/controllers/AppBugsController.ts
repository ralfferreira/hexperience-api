import { Request, Response } from "express";
import { container } from "tsyringe";

import ListAllReportedBugsService from "@modules/admin/services/ListAllReportedBugsService";
import ResolveAppBugService from "@modules/admin/services/ResolveAppBugService";
import ShowAppBugService from "@modules/admin/services/ShowAppBugService";

export default class AppBugsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listAllReportedBugs = container.resolve(ListAllReportedBugsService);

    const appBugs = await listAllReportedBugs.execute();

    return response.json(appBugs);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { bug_id } = request.params;
    const { resolved } = request.body;

    const resolveAppBug = container.resolve(ResolveAppBugService);

    const resolvedBug = await resolveAppBug.execute({
      id: bug_id,
      resolved
    });

    return response.json(resolvedBug);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { bug_id } = request.params;

    const showAppBug = container.resolve(ShowAppBugService);

    const appBug = await showAppBug.execute(bug_id);

    return response.json(appBug);
  }
}
