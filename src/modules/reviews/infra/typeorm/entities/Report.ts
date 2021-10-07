import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from "typeorm";

import Host from "../../../../users/infra/typeorm/entities/Host";
import Experience from "../../../../experiences/infra/typeorm/entities/Experience";

@Entity('Report')
class Report {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  comment: string;

  @Column()
  reason: string;

  @Column({ type: 'boolean', default: false })
  is_resolved: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Host)
  @JoinColumn({ name: 'host_id' })
  host: Host;

  @ManyToOne(() => Experience)
  @JoinColumn({ name: 'exp_id' })
  experience: Experience;
}

export default Report;
