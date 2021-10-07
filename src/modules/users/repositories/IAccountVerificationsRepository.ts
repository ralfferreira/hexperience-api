import ICreateUserDTO from "../dtos/ICreateUserDTO";
import {
  AccountVerificationType
} from "../infra/mongoose/schemas/AccountVerifications";

export default interface IAccountVerificationsRepository {
  create(data: ICreateUserDTO): Promise<AccountVerificationType>;
  findByEmail(email: string): Promise<AccountVerificationType | null>;
  findByToken(token: string): Promise<AccountVerificationType | null>;
  delete(token: string): Promise<void>;
}
