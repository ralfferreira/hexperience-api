import { inject, injectable } from "tsyringe";

import AppError from "@shared/errors/AppError";

import IAppBugsRepository from "../repositories/IAppBugsRepository";

import { AppBugType } from "../infra/mongoose/schemas/AppBug";

@injectable()
class ShowAppBugService {
  constructor (
    @inject('AppBugsRepository')
    private appBugsRepository: IAppBugsRepository
  ) {}

  public async execute(id: string): Promise<AppBugType> {
    const appBug = await this.appBugsRepository.findById(id);

    if (!appBug) {
      throw new AppError('AppBug não existe');
    }

    return appBug;
  }
}

export default ShowAppBugService;
