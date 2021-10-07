import { HostRequestType } from "../infra/mongoose/schemas/HostRequests";

import ICreateHostRequestDTO from "../dtos/ICreateHostRequestDTO";

export default interface IHostRequestsRepository {
  create(data: ICreateHostRequestDTO): Promise<HostRequestType>;
  findAll(): Promise<HostRequestType[]>;
  findByUserId(user_id: number): Promise<HostRequestType | null>;
  findByNickname(nickname: string): Promise<HostRequestType | null>;
  delete(user_id: number): Promise<void>;
}
