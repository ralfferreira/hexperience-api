import ICreateHostDTO from "../dtos/ICreateHostDTO";
import ISearchForHostsDTO from "../dtos/ISearchForHostsDTO";
import Host from "../infra/typeorm/entities/Host";

export default interface IHostsRepository {
  create(data: ICreateHostDTO): Promise<Host>;
  findById(id: number): Promise<Host | undefined>;
  findByNickname(nickname: string): Promise<Host | undefined>;
  update(host: Host): Promise<Host>;
  findByUserId(user_id: number): Promise<Host | undefined>;
  findAll(options: ISearchForHostsDTO): Promise<Host[]>;
  findAllReported(): Promise<Host[]>;
}
