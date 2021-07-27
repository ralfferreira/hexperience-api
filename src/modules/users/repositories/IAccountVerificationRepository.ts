import ICreateUserDTO from "../dtos/ICreateUserDTO";
import { 
  AccountVerification as AccountVerificationType 
} from "../infra/mongoose/schemas/AccountVerification";

export default interface IAccountVerificationRepository {
  create(data: ICreateUserDTO): Promise<AccountVerificationType>;
  findByEmail(email: string): Promise<AccountVerificationType | null>;
  findByToken(token: string): Promise<AccountVerificationType | null>;
  delete(token: string): Promise<void>;
}