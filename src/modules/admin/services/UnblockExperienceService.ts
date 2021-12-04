import { inject, injectable } from "tsyringe";
import { isAfter } from "date-fns";

import AppError from "@shared/errors/AppError";

import Experience from "@modules/experiences/infra/typeorm/entities/Experience";

import IExperiencesRepository from "@modules/experiences/repositories/IExperiencesRepository";
import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentsRepository";
import INotificationsRepository from "@modules/notifications/repositories/INotificationsRepository";
import IHostsRepository from "@modules/users/repositories/IHostsRepository";

@injectable()
class UnblockExperienceService {
  constructor (
    @inject('ExperiencesRepository')
    private experiencesRepository: IExperiencesRepository,

    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('HostsRepository')
    private hostsRepository: IHostsRepository
  ) {}

  public async execute(exp_id: number): Promise<Experience> {
    const experience = await this.experiencesRepository.findById(exp_id);

    if (!experience) {
      throw new AppError('Experiência não existe');
    }

    if (!experience.is_blocked) {
      return experience;
    }

    experience.is_blocked = false;

    await this.experiencesRepository.update(experience);

    const allAppointments = await this.appointmentsRepository.findByExperienceId(experience.id);

    const allFutureAppointments = allAppointments.filter(appointment => {
      if (isAfter(appointment.schedule.date, new Date())){
        return appointment;
      }
    });

    for (const appointment of allFutureAppointments) {
      await this.notificationsRepository.create({
        title: 'Expeiência agendada foi desbloqueada',
        message:
          `A Experiência "${experience.name}" que você agendou, acaba de ser desbloqueada.`,
        receiver_id: appointment.user.id,
        appointment_id: appointment.id,
        exp_id: experience.id,
        host_id: experience.host.id,
        schedule_id: appointment.schedule.id
      });
    }

    const host = await this.hostsRepository.findById(experience.host.id);

    if (!host) {
      throw new AppError('Anfitrião não existe');
    }

    await this.notificationsRepository.create({
      title: 'Expeiência desbloqueada',
      message:
        `A sua experiência "${experience.name}" acaba de ser desbloqueada.`,
      receiver_id: host.user.id,
      exp_id: experience.id,
      host_id: experience.host.id,
    });

    return experience;
  }
}

export default UnblockExperienceService;
