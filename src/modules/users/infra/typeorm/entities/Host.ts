import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import User from './User';

@Entity('Host')
class Host {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  cpf?: string;

  @Column()
  cnpj?: string;

  @Column()
  nickname: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(type => User, user => user.host)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}

export default Host;
