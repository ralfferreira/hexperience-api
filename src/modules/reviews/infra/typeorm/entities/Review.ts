import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import User from "../../../../users/infra/typeorm/entities/User";
import Host from "../../../../users/infra/typeorm/entities/Host";
import Experience from "../../../../experiences/infra/typeorm/entities/Experience";

@Entity('Review')
class Review {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  comment: string;

  @Column()
  rating: number

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Host)
  @JoinColumn({ name: 'host_id' })
  host: Host;

  @ManyToOne(() => Experience)
  @JoinColumn({ name: 'exp_id' })
  experience: Experience;
}

export default Review;
