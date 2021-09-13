import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('AdminConfigure')
class AdminConfigure {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  reports_to_block: number;

  @Column()
  days_blocked: number;

  @CreateDateColumn()
  created_at: Date;
}

export default AdminConfigure;
