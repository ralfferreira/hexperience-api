import { inject, injectable } from "tsyringe";

import AppError from "@shared/errors/AppError";

import IAppBugsRepository from "../repositories/IAppBugsRepository";

import { AppBugType } from "../infra/mongoose/schemas/AppBug";

interface IRequest {
  id: string;
  resolved: boolean;
}

@injectable()
class ResolveAppBugService {
  constructor (
    @inject('AppBugsRepository')
    private appBugsRepository: IAppBugsRepository
  ) {}

  public async execute({ id, resolved }: IRequest): Promise<AppBugType> {
    const appBug = await this.appBugsRepository.findById(id);

    if (!appBug) {
      throw new AppError('AppBug does not exists');
    }

    appBug.resolved = resolved;

    const updatedAppBug = await this.appBugsRepository.update(appBug);

    return updatedAppBug;
  }
}

export default ResolveAppBugService;
