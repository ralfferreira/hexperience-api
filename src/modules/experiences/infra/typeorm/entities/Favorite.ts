import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";

import User from "@modules/users/infra/typeorm/entities/User";
import Experience from "./Experience";

@Entity('Favorite')
class Favorite {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: true, default: undefined })
  folder?: string;

  @ManyToOne(() => User, user => user.favorites)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Experience, experience => experience.favorites)
  @JoinColumn({ name: 'exp_id' })
  experience: Experience;
}

export default Favorite;
