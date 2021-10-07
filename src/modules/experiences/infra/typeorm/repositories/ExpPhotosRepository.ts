import { getRepository, Repository } from "typeorm";

import IExpPhotosRepository from "@modules/experiences/repositories/IExpPhotosRepository";
import ICreateExpPhotoDTO from "@modules/experiences/dtos/ICreateExpPhotoDTO";

import ExpPhoto from "../entities/ExpPhoto";

class ExpPhotosRepository implements IExpPhotosRepository {
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

  public async findById(id: number): Promise<ExpPhoto | undefined> {
    const photo = await this.ormRepository.findOne({
      relations: ['experience'],
      where: {
        id: id
      }
    });

    return photo;
  }

  public async delete(photo: ExpPhoto): Promise<void> {
    await this.ormRepository.remove(photo);
  }
}

export default ExpPhotosRepository
