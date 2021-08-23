import { Model } from 'mongoose';

import HostRequests, { HostRequests as HostRequestsType } from '../schemas/HostRequests';

import IHostRequestsRepository from '@modules/users/repositories/IHostRequestsRepository';
import ICreateHostRequestDTO from '@modules/users/dtos/ICreateHostRequestDTO';

class HostRequestsRepository implements IHostRequestsRepository {
  private model: Model<HostRequestsType>;

  constructor () {
    this.model = HostRequests;
  }

  public async create({
    cpf,
    cnpj,
    user_id,
    nickname
  }: ICreateHostRequestDTO): Promise<HostRequestsType> {
    const hostRequest = new this.model({
      cpf: cpf,
      cnpj: cnpj,
      user_id: user_id,
      nickname: nickname
    });

    await hostRequest.save();

    return hostRequest;
  }

  public async getAll(): Promise<HostRequestsType[]> {
    const hostRequests = await this.model.find({});

    return hostRequests;
  }

  public async findByUserId(user_id: number): Promise<HostRequestsType | null> {
    const hostRequest = await this.model.findOne({
      user_id: user_id
    }).exec();

    return hostRequest;
  }

  public async findByNickname(nickname: string): Promise<HostRequestsType | null> {
    const hostRequest = await this.model.findOne({
      nickname: nickname
    }).exec();

    return hostRequest;
  }

  public async delete(user_id: number): Promise<void> {
    await this.model.deleteOne({
      user_id: { $eq: user_id}
    });
  }
}

export default HostRequestsRepository;
