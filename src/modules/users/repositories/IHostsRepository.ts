import ICreateHostDTO from "../dtos/ICreateHostDTO";
import Host from "../infra/typeorm/entities/Host";

export default interface IHostsRepository {
  create(data: ICreateHostDTO): Promise<Host>;
  findByNickname(nickname: string): Promise<Host | undefined>;
}
