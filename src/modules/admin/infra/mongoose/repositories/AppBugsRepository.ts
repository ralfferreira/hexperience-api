import mongoose, { Model } from "mongoose";

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

  public async findById(id: string): Promise<AppBugType | null> {
    const objId = mongoose.Types.ObjectId(id);

    const appBug = await this.model.findById(objId);

    return appBug;
  }

  public async update(bug: AppBugType): Promise<AppBugType> {
    return bug.save();
  }
}

export default AppBugsRepository;
