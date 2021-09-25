import { injectable, inject } from "tsyringe";

import AppError from "@shared/errors/AppError";

import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import IExperiencesRepository from "@modules/experiences/repositories/IExperiencesRepository";
import IAdminConfigureRepository from "@modules/admin/repositories/IAdminConfigureRepository";
import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentsRepository";
import INotificationsRepository from "@modules/notifications/repositories/INotificationsRepository";

@injectable()
class ManageExperienceReportsService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ExperiencesRepository')
    private experiencesRepository: IExperiencesRepository,

    @inject('AdminConfigureRepository')
    private adminConfigureRepository: IAdminConfigureRepository,

    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
  ) {}

  public async execute(exp_id: number): Promise<void> {
    const experience = await this.experiencesRepository.findById(exp_id);

    if (!experience) {
      throw new AppError('Experience does not exists');
    }

    if (experience.is_blocked) {
      return;
    }

    const unresolvedReports = experience.reports.filter(report => {
      if (!report.is_resolved) {
        return report;
      }
    });

    const host = await this.usersRepository.findByHostId(experience.host.id);

    if (!host) {
      throw new AppError('Host does not exists');
    }

    const adminConfigure = await this.adminConfigureRepository.findLatest();

    if (!adminConfigure) {
      throw new AppError('AdminConfigure does not exists!');
    }

    if (unresolvedReports.length < adminConfigure.reports_to_block) {
      return;
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

    for (const appointment of appointments) {
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
  }
}

export default ManageExperienceReportsService;
