import { inject, injectable } from 'tsyringe'

import AppError from '@shared/errors/AppError';

import IExperiencesRepository from '../repositories/IExperiencesRepository';
import IHostsRepository from '@modules/users/repositories/IHostsRepository';
import ICategoriesRepository from '../repositories/ICategoriesRepository';

import Experience from '../infra/typeorm/entities/Experience';
import { statusEnum } from '@modules/users/infra/typeorm/entities/User';

interface IRequest {
  name: string;
  duration: number;
  description: string;
  price: number;
  requirements: string;
  parental_rating: number;
  max_guests: number;
  address: string;
  latitude: number;
  longitude: number;
  is_online: boolean;
  host_id: number;
  category_id: number;
}

@injectable()
class CreateExperienceService {
  constructor(
    @inject('ExperiencesRepository')
    private experiencesRepository: IExperiencesRepository,

    @inject('HostsRepository')
    private hostsRepository: IHostsRepository,

    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository
  ) {}

  public async execute({
    name,
    duration,
    address,
    description,
    latitude,
    longitude,
    max_guests,
    parental_rating,
    price,
    requirements,
    host_id,
    is_online,
    category_id
  }: IRequest): Promise<Experience>{
    const host = await this.hostsRepository.findById(host_id);

    if (!host) {
      throw new AppError('Host does not exists');
    }

    if (host.user.status !== statusEnum.ok) {
      throw new AppError('Anfitrião não pode realizar essa ação por estar em análise ou bloqueado');
    }

    const category = await this.categoriesRepository.findById(category_id);

    if (!category) {
      throw new AppError('Categoria não existe');
    }

    if (duration > 360) {
      throw new AppError('Uma experiência não pode durar mais que 6 horas');
    }

    const experience = await this.experiencesRepository.create({
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
      requirements,
      category
    });

    return experience;
  }
}

export default CreateExperienceService
