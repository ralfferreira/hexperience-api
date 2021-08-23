import { HostRequests as HostRequestsType } from "../infra/mongoose/schemas/HostRequests";

import ICreateHostRequestDTO from "../dtos/ICreateHostRequestDTO";

export default interface IHostRequestsRepository {
  create(data: ICreateHostRequestDTO): Promise<HostRequestsType>;
  getAll(): Promise<HostRequestsType[]>;
  findByUserId(user_id: number): Promise<HostRequestsType | null>;
  findByNickname(nickname: string): Promise<HostRequestsType | null>;
  delete(user_id: number): Promise<void>;
}
