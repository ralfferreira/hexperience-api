import User from "../../infra/typeorm/entities/User";

import ICreateUserDTO from "../../dtos/ICreateUserDTO";
import IUsersRepository from "../IUsersRepository";

class FakeUsersRepository implements IUsersRepository {
  private users: User[];

  constructor(){
    this.users = [];
  }

  public allUsers(): User[] {
    return this.users;
  }

  public async findById(id: number): Promise<User | undefined> {
    const findUser = this.users.find(user => id === user.id);

    return findUser;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.users.find(user => email === user.email);

    return findUser;
  }

  public async create(createUserData: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, createUserData);

    this.users.push(user);

    return user;
  }

  public async update(user: User): Promise<User> {
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);

    this.users[findIndex] = user;

    return user;
  }
}

export default FakeUsersRepository;
