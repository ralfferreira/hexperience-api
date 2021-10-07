import { inject, injectable } from "tsyringe";

import Category from "../infra/typeorm/entities/Category";
import ICategoriesRepository from "../repositories/ICategoriesRepository";

@injectable()
class ListAllAvailableCategoriesService {
  constructor (
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository
  ) {}

  public async execute(): Promise<Category[]> {
    const categories = await this.categoriesRepository.findAll();

    return categories;
  }
}

export default ListAllAvailableCategoriesService;
