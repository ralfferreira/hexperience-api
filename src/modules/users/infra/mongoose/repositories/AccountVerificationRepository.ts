import { Model } from "mongoose";

import AccountVerification, { 
  AccountVerification as AccountVerificationType 
} from "../schemas/AccountVerification";

import IAccountVerificationRepository from "@modules/users/repositories/IAccountVerificationRepository";

import ICreateUserDTO from "@modules/users/dtos/ICreateUserDTO";

class AccountVerificationRepository implements IAccountVerificationRepository {
  private model: Model<AccountVerificationType>;
  
  constructor () {
    this.model = AccountVerification;
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
    this.model.deleteOne({
      token: token
    });
  }
}

export default AccountVerificationRepository;