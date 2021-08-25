import { inject, injectable } from 'tsyringe'

import AppError from '@shared/errors/AppError';

import IExperiencesRepository from '../repositories/IExperiencesRepository';
import IHostsRepository from '@modules/users/repositories/IHostsRepository';

import Experience from '../infra/typeorm/entities/Experience';

interface IRequest {
  name: string;
  duration: number;
  description: string;
  price: number;
  requirements: string;
  parental_rating: number;
  address: string;
  latitude: number;
  longitude: number;
  is_online: boolean;
  host_id: number;
}

@injectable()
class CreateExperienceService {
  constructor(
    @inject('ExperiencesRepository')
    private experiencesRepository: IExperiencesRepository,

    @inject('HostsRepository')
    private hostsRepository: IHostsRepository
  ) {}

  public async execute({
    name,
    duration,
    address,
    description,
    latitude,
    longitude,
    parental_rating,
    price,
    requirements,
    host_id,
    is_online
  }: IRequest): Promise<Experience>{
    const host = await this.hostsRepository.findById(host_id);

    if (!host) {
      throw new AppError('Host does not exists');
    }

    if (duration > 360) {
      throw new AppError('Experience can not last more than 6 hours');
    }

    const experience = await this.experiencesRepository.create({
      address,
      description,
      duration,
      host,
      is_online,
      latitude,
      longitude,
      name,
      parental_rating,
      price,
      requirements
    });

    return experience;
  }
}

export default CreateExperienceService
