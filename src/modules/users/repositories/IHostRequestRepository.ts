import { HostRequest as HostRequestType } from "../infra/mongoose/schemas/HostRequest";

import ICreateHostRequestDTO from "../dtos/ICreateHostRequestDTO";

export default interface IHostRequestRepository {
  create(data: ICreateHostRequestDTO): Promise<HostRequestType>;
  getAll(): Promise<HostRequestType[]>;
  findByUserId(user_id: number): Promise<HostRequestType | null>;
  findByNickname(nickname: string): Promise<HostRequestType | null>;
  delete(user_id: number): Promise<void>;
}