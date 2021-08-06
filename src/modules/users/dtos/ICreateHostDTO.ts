import User from "../infra/typeorm/entities/User";

export default interface ICreateHostDTO {
  cpf?: string;
  cnpj?: string;
  nickname: string;
  user: User;
}
