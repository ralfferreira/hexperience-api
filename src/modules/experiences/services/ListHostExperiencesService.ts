import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IHostsRepository from '@modules/users/repositories/IHostsRepository';
import IExperiencesRepository from '../repositories/IExperiencesRepository';

import Experience from '../infra/typeorm/entities/Experience';

@injectable()
class ListHostExperiencesService {
  constructor (
    @inject('HostsRepository')
    private hostsRepository: IHostsRepository,

    @inject('ExperiencesRepository')
    private experiencesRepository: IExperiencesRepository
  ) {}

  public async execute(host_id: number): Promise<Experience[]> {
    const host = await this.hostsRepository.findById(host_id);

    if (!host) {
      throw new AppError('Host does not exists');
    }

    const experiences = await this.experiencesRepository.findByHostId(host.id);

    return experiences;
  }
}

export default ListHostExperiencesService;
