import { getRepository, Repository } from "typeorm";

import IExpPhotoRepository from "@modules/experiences/repositories/IExpPhotoRepository";
import ICreateExpPhotoDTO from "@modules/experiences/dtos/ICreateExpPhotoDTO";

import ExpPhoto from "../entities/ExpPhoto";

class ExpPhotoRepository implements IExpPhotoRepository {
  private ormRepository: Repository<ExpPhoto>;

  constructor () {
    this.ormRepository = getRepository(ExpPhoto);
  }

  public async create({ photo, experience }: ICreateExpPhotoDTO): Promise<ExpPhoto> {
    const expPhoto = await this.ormRepository.create({
      photo,
    });

    expPhoto.experience = experience;

    await this.ormRepository.save(expPhoto);

    return expPhoto;
  }

  public async findAllByExpId(id: number): Promise<ExpPhoto[]> {
    const photos = await this.ormRepository.find({
      relations: ['experience'],
      where: {
        experience: {
          id: id
        }
      }
    });

    return photos;
  }

  public async update(photo: ExpPhoto): Promise<ExpPhoto> {
    return this.ormRepository.save(photo);
  }
}

export default ExpPhotoRepository
