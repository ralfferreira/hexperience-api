import ICreateUserDTO from "../dtos/ICreateUserDTO";
import User from "../infra/typeorm/entities/User";

export default interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<User>;
  findByEmail(email: string): Promise<User | undefined>;
  findById(id: number): Promise<User | undefined>;
  update(user: User): Promise<User>;
  findAllAdmins(): Promise<User[]>;
}
