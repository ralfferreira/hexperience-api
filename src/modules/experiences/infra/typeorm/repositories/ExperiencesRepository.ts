import { getRepository, Repository } from "typeorm";

import Experience from "../entities/Experience";

import IExperiencesRepository from '@modules/experiences/repositories/IExperiencesRepository';
import ICreateExperienceDTO from "@modules/experiences/dtos/ICreateExperienceDTO";
import ISearchForExperienceDTO from "@modules/experiences/dtos/ISearchForExperienceDTO";

class ExperiencesRepository implements IExperiencesRepository {
  private ormRepository: Repository<Experience>;

  constructor() {
    this.ormRepository = getRepository(Experience, global.env.RDB_CONNECTION);
  }

  public async create({
    address,
    description,
    duration,
    host,
    is_online,
    latitude,
    longitude,
    max_guests,
    name,
    parental_rating,
    price,
    requirements
  }: ICreateExperienceDTO): Promise<Experience> {
    const experience = await this.ormRepository.create({
      address,
      description,
      duration,
      is_online,
      latitude,
      longitude,
      max_guests,
      name,
      parental_rating,
      price,
      requirements,
      is_blocked: false
    });

    experience.host = host;

    await this.ormRepository.save(experience);

    return experience;
  }

  public async findById(id: number): Promise<Experience | undefined> {
    const experience = await this.ormRepository.findOne({
      relations: ['host', 'schedules', 'reviews', 'reports', 'category', 'photos'],
      where: {
        id: id
      }
    });

    return experience;
  }

  public async update(experience: Experience): Promise<Experience> {
    return this.ormRepository.save(experience);
  }

  public async findAllAvailable({
    host_id,
    name,
    is_online,
    max_duration,
    min_duration,
    max_price,
    min_price,
    parental_rating,
    categories
  }: ISearchForExperienceDTO): Promise<Experience[]> {
    const query = await this.ormRepository.createQueryBuilder('e')
      .leftJoinAndSelect('e.host', 'h')
      .leftJoinAndSelect('e.schedules', 's')
      .leftJoinAndSelect('e.reviews', 'rw')
      .leftJoinAndSelect('e.reports', 'rp')
      .leftJoinAndSelect('e.category', 'c')
      .leftJoinAndSelect('e.photos', 'p')
      .where('e.is_blocked = :isNotBlocked', { isNotBlocked: false })
      .andWhere('e.hidden = :isNotHidden', { isNotHidden: false })
      .andWhere('s.exp_id IS NOT NULL');

    if (host_id) {
      await query.andWhere('e.host.id != :hostId', { hostId: host_id });
    }

    if (name) {
      await query.andWhere('e.name LIKE :findName', { findName: `%${name}%` });
    }

    if (is_online !== undefined) {
      await query.andWhere('e.is_online = :isOnline', { isOnline: is_online });
    }

    if (max_duration) {
      await query.andWhere('e.duration <= :maxDuration', { maxDuration: max_duration });
    }

    if (min_duration) {
      await query.andWhere('e.duration >= :minDuration', { minDuration: min_duration });
    }

    if (max_price) {
      await query.andWhere('e.price <= :maxPrice', { maxPrice: max_price });
    }

    if (min_price) {
      await query.andWhere('e.price >= :minPrice', { minPrice: min_price });
    }

    if (parental_rating) {
      await query.andWhere('e.parental_rating <= :parentalRating', { parentalRating: parental_rating });
    }

    if (categories?.length) {
      await query.andWhere('e.category_id IN (:...categoryIds)', { categoryIds: categories });
    }

    const experiences = await query.printSql().getMany();

    return experiences;
  }

  public async findByHostId(host_id: number): Promise<Experience[]> {
    const experience = await this.ormRepository.find({
      relations: ['host', 'schedules', 'reviews', 'reports', 'category', 'photos'],
      where: {
        host: {
          id: host_id
        }
      }
    });

    return experience;
  }

  public async findAllReported(): Promise<Experience[]> {
    const query = await this.ormRepository.createQueryBuilder('e')
      .leftJoinAndSelect('e.host', 'h')
      .leftJoinAndSelect('e.schedules', 's')
      .leftJoinAndSelect('e.reviews', 'rw')
      .innerJoinAndSelect('e.reports', 'rp')
      .leftJoinAndSelect('e.category', 'c')
      .leftJoinAndSelect('e.photos', 'p')

    const experiences = await query.getMany();

    return experiences;
  }
}

export default ExperiencesRepository;
