import { Model } from "mongoose";

import IAppBugsRepository from "@modules/admin/repositories/IAppBugsRepository";

import AppBug, { AppBugType } from "../schemas/AppBug";

import ICreateAppBugDTO from "@modules/admin/dtos/ICreateAppBugDTO";

class AppBugsRepository implements IAppBugsRepository {
  private model: Model<AppBugType>;

  constructor () {
    this.model = AppBug;
  }

  public async create({ what, where, description }: ICreateAppBugDTO): Promise<AppBugType> {
    const appBug = new this.model({
      what,
      where,
      description
    });

    await appBug.save();

    return appBug;
  }

  public async findAll(): Promise<AppBugType[]> {
    const appBugs = await this.model.find({});

    return appBugs;
  }
}

export default AppBugsRepository;
