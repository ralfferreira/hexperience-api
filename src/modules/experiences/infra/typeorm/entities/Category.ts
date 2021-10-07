import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('Category')
class Category {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;
}

export default Category;
