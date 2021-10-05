import { inject, injectable } from "tsyringe";
import { isBefore } from "date-fns";

import AppError from "@shared/errors/AppError";

import IHostsRepository from "@modules/users/repositories/IHostsRepository";
import IAppointmentsRepository from "../repositories/IAppointmentsRepository";

import Appointment from "../infra/typeorm/entities/Appointment";

@injectable()
class ListOnlyHostAppointmentsService {
  constructor (
    @inject('HostsRepository')
    private hostsRepository: IHostsRepository,

    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) {}

  public async execute(host_id: number): Promise<Appointment[]> {
    const host = await this.hostsRepository.findById(host_id);

    if (!host) {
      throw new AppError('Host does not exists');
    }

    const appointments = await this.appointmentsRepository.findByHostId(host.id);

    appointments.sort((a, b) => {
      if (isBefore(a.schedule.date, b.schedule.date)) {
        return 1;
      }

      return -1;
    });

    return appointments;
  }
}

export default ListOnlyHostAppointmentsService;
