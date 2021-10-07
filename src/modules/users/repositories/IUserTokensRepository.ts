import { UserTokenType } from "../infra/mongoose/schemas/UserTokens";

export default interface IUserTokenRepository {
  create(token: string, id: number): Promise<UserTokenType>;
  findByToken(token: string): Promise<UserTokenType | null>;
  delete(token: string): Promise<void>;
}
