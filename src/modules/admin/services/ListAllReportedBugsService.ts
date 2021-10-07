import { inject, injectable } from "tsyringe";

import IAppBugsRepository from "../repositories/IAppBugsRepository";

import { AppBugType } from "../infra/mongoose/schemas/AppBug";

@injectable()
class ListAllReportedBugsService {
  constructor (
    @inject('AppBugsRepository')
    private appBugsRepository: IAppBugsRepository
  ) {}

  public async execute(): Promise<AppBugType[]> {
    const appBugs = await this.appBugsRepository.findAll();

    return appBugs;
  }
}

export default ListAllReportedBugsService;
