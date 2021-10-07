import { Model } from "mongoose";

import AccountVerifications, {
  AccountVerificationType
} from "../schemas/AccountVerifications";

import IAccountVerificationsRepository from "@modules/users/repositories/IAccountVerificationsRepository";

import ICreateUserDTO from "@modules/users/dtos/ICreateUserDTO";

class AccountVerificationsRepository implements IAccountVerificationsRepository {
  private model: Model<AccountVerificationType>;

  constructor () {
    this.model = AccountVerifications;
  }

  public async create(data: ICreateUserDTO): Promise<AccountVerificationType> {
    const accountVerification = new this.model({
      name: data.name,
      email: data.email,
      password: data.password,
      token: data.token
    });

    await accountVerification.save();

    return accountVerification;
  }

  public async findByEmail(email: string): Promise<AccountVerificationType | null> {
    const accountVerification = await this.model.findOne({
      email: email
    }).exec();

    return accountVerification;
  }

  public async findByToken(token: string): Promise<AccountVerificationType | null> {
    const accountVerification = await this.model.findOne({
      token: token
    }).exec();

    return accountVerification;
  }

  public async delete(token: string): Promise<void> {
    await this.model.deleteOne({
      token: { $eq: token}
    });
  }
}

export default AccountVerificationsRepository;
