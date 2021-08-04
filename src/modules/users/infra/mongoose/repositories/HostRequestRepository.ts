import { Model } from 'mongoose';

import HostRequest, { HostRequest as HostRequestType } from '../schemas/HostRequest';

import IHostRequestRepository from '@modules/users/repositories/IHostRequestRepository';
import ICreateHostRequestDTO from '@modules/users/dtos/ICreateHostRequestDTO';

class HostRequestRepository implements IHostRequestRepository {
  private model: Model<HostRequestType>;

  constructor () {
    this.model = HostRequest;
  }

  public async create({ 
    cpf, 
    cnpj, 
    user_id, 
    nickname 
  }: ICreateHostRequestDTO): Promise<HostRequestType> {
    const hostRequest = new this.model({
      cpf: cpf,
      cnpj: cnpj,
      user_id: user_id,
      nickname: nickname
    });

    await hostRequest.save();

    return hostRequest;
  }

  public async getAll(): Promise<HostRequestType[]> {
    const hostRequests = await this.model.find({});

    return hostRequests;
  }

  public async findByUserId(user_id: number): Promise<HostRequestType | null> {
    const hostRequest = await this.model.findOne({
      user_id: user_id
    }).exec();

    return hostRequest;
  }

  public async findByNickname(nickname: string): Promise<HostRequestType | null> {
    const hostRequest = await this.model.findOne({
      nickname: nickname
    }).exec();

    return hostRequest;
  }

  public async delete(user_id: number): Promise<void> {
    await this.model.deleteOne({
      user_id: user_id
    });
  }
}

export default HostRequestRepository;