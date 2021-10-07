import Category from "../infra/typeorm/entities/Category";

export default interface ICategoriesRepository {
  findById(id: number): Promise<Category | undefined>;
  findAll(): Promise<Category[]>;
}
