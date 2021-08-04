import { UserToken as UserTokenType } from "../infra/mongoose/schemas/UserToken";

export default interface IUserTokenRepository {
  create(token: string, id: number): Promise<UserTokenType>;
  findByToken(token: string): Promise<UserTokenType | null>;
  delete(token: string): Promise<void>;
}