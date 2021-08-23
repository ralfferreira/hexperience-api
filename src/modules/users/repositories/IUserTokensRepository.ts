import { UserTokens as UserTokensType } from "../infra/mongoose/schemas/UserTokens";

export default interface IUserTokenRepository {
  create(token: string, id: number): Promise<UserTokensType>;
  findByToken(token: string): Promise<UserTokensType | null>;
  delete(token: string): Promise<void>;
}
