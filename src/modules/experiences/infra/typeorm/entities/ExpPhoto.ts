import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from "typeorm";
import Experience from "./Experience";

@Entity('ExpPhoto')
class ExpPhoto {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  photo: string;

  @ManyToOne(() => Experience, exp => exp.schedules)
  @JoinColumn({ name: 'exp_id' })
  experience: Experience;
}

export default ExpPhoto;
