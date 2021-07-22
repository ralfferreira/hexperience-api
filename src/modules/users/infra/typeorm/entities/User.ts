import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { Exclude } from 'class-transformer';

export enum typeEnum {
  user = 'user',
  host = 'host',
  admin = 'admin'
}

@Entity('User')
class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  avatar: string;

  @Column()
  phone_number: string;

  @Column()
  bio: string;

  @Column({ type: 'boolean' })
  is_blocked: boolean;

  @Column({
    type: 'enum',
    enum: typeEnum,
    default: typeEnum.user
  })
  type: typeEnum;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default User;
