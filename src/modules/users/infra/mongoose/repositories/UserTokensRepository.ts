import { Model } from 'mongoose';

import UserTokens, { UserTokenType } from "../schemas/UserTokens";

import IUserTokensRepository from "@modules/users/repositories/IUserTokensRepository";

class UserTokensRepository implements IUserTokensRepository {
  private model: Model<UserTokenType>;

  constructor () {
    this.model = UserTokens;
  }

  public async create(token: string, id: number): Promise<UserTokenType> {
    const userToken = new this.model({
      token: token,
      user_id: id,
    });

    await userToken.save();

    return userToken;
  }

  public async findByToken(token: string): Promise<UserTokenType | null> {
    const userToken = await this.model.findOne({
      token: token
    }).exec();

    return userToken;
  }

  public async delete(token: string): Promise<void> {
    await this.model.deleteOne({
      token: { $eq: token}
    });
  }
}

export default UserTokensRepository;
