import { Model } from 'mongoose';

import UserToken, { UserToken as UserTokenType } from "../schemas/UserToken";

import IUserTokenRepository from "@modules/users/repositories/IUserTokenRepository";

class UserTokenRepository implements IUserTokenRepository {
  private model: Model<UserTokenType>;

  constructor () {
    this.model = UserToken;
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
      token: token
    });
  }
}

export default UserTokenRepository;