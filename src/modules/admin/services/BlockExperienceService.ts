import { inject, injectable } from "tsyringe";
import { isAfter } from "date-fns";

import AppError from "@shared/errors/AppError";

import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentsRepository";
import IExperiencesRepository from "@modules/experiences/repositories/IExperiencesRepository";
import INotificationsRepository from "@modules/notifications/repositories/INotificationsRepository";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";

import Experience from "@modules/experiences/infra/typeorm/entities/Experience";

@injectable()
class BlockExperienceService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ExperiencesRepository')
    private experiencesRepository: IExperiencesRepository,

    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
  ) {}

  public async execute(exp_id: number): Promise<Experience> {
    const experience = await this.experiencesRepository.findById(exp_id);

    if (!experience) {
      throw new AppError('Experience does not exists');
    }

    if (experience.is_blocked) {
      return experience;
    }

    const host = await this.usersRepository.findByHostId(experience.host.id);

    if (!host) {
      throw new AppError('Host does not exists');
    }

    const admins = await this.usersRepository.findAllAdmins();

    experience.is_blocked = true;

    await this.experiencesRepository.update(experience);

    for (const admin of admins) {
      await this.notificationsRepository.create({
        title: 'Experiência bloqueada',
        message:
          `A experiência "${experience.name}" foi bloqueada por excesso de denúncias. ` +
          `Verifique o caso e tome as devidas providências.`,
        receiver_id: admin.id,
        exp_id: experience.id,
        host_id: host.id
      })
    }

    await this.notificationsRepository.create({
      title: 'Experiência bloqueada',
      message:
          `Sua experiência "${experience.name}" foi bloqueada por excesso de denúncias. ` +
          `Verifique o caso e tome as devidas providências.`,
      receiver_id: host.id,
      exp_id: experience.id,
    });

    const appointments = await this.appointmentsRepository.findByExperienceId(experience.id);

    const futureAppointments = appointments.filter(a => {
      if (isAfter(a.schedule.date, new Date())) {
        return a;
      }
    })

    for (const appointment of futureAppointments) {
      await this.notificationsRepository.create({
        title: 'Experiência agendada foi bloqueada',
        message:
          `A experiência "${experience.name}" que você agendou foi bloqueada por ` +
          `excesso de denúncias. Verifique se deseja manter o agendamento`,
        receiver_id: appointment.user.id,
        appointment_id: appointment.id,
        exp_id: experience.id,
        host_id: host.host.id,
        schedule_id: appointment.schedule.id
      });
    }

    return experience;
  }
}

export default BlockExperienceService;
