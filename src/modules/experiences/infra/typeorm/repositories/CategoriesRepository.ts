import { getRepository, Repository } from "typeorm";

import ICategoriesRepository from "@modules/experiences/repositories/ICategoriesRepository";

import Category from "../entities/Category";

class CategoriesRepository implements ICategoriesRepository {
  private ormRepository: Repository<Category>

  constructor () {
    this.ormRepository = getRepository(Category);
  }

  public async findById(id: number): Promise<Category | undefined> {
    const category = await this.ormRepository.findOne({
      where: {
        id: id,
      }
    });

    return category;
  }
}

export default CategoriesRepository;
