import ICreateUserDTO from "../dtos/ICreateUserDTO";
import {
  AccountVerifications as AccountVerificationsType
} from "../infra/mongoose/schemas/AccountVerifications";

export default interface IAccountVerificationsRepository {
  create(data: ICreateUserDTO): Promise<AccountVerificationsType>;
  findByEmail(email: string): Promise<AccountVerificationsType | null>;
  findByToken(token: string): Promise<AccountVerificationsType | null>;
  delete(token: string): Promise<void>;
}
