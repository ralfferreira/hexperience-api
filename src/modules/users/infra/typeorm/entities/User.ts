import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import Host from './Host';
import Favorite from '../../../../experiences/infra/typeorm/entities/Favorite';

export enum typeEnum {
  user = 'user',
  host = 'host',
  admin = 'admin'
}

export enum statusEnum {
  ok = 'ok',
  analyzing = 'analyzing',
  blocked = 'blocked'
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

  @Column({
    type: 'enum',
    enum: statusEnum,
    default: statusEnum.ok
  })
  status: statusEnum;

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

  @OneToOne(type => Host, host => host.user)
  host: Host;

  @OneToMany(() => Favorite, favorite => favorite.user)
  favorites: Favorite[];
}

export default User;
