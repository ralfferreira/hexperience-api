import { injectable, inject } from "tsyringe";

import AppError from "@shared/errors/AppError";

import IReportsRepository from "@modules/reviews/repositories/IReportsRepository";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import IExperiencesRepository from "@modules/experiences/repositories/IExperiencesRepository";
import IAdminConfigureRepository from "@modules/admin/repositories/IAdminConfigureRepository";
import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentsRepository";
import INotificationsRepository from "@modules/notifications/repositories/INotificationsRepository";

import { statusEnum } from "@modules/users/infra/typeorm/entities/User";

import Report from "@modules/reviews/infra/typeorm/entities/Report";

interface IRequest {
  reported_id: number;
  type: 'host' | 'exp'
}

@injectable()
class ManageReportsService {
  constructor (
    @inject('ReportsRepository')
    private reportsRepository: IReportsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ExperiencesRepository')
    private experiencesRepository: IExperiencesRepository,

    @inject('AdminConfigureRepository')
    private adminConfigureRepository: IAdminConfigureRepository,

    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository
  ) {}

  public async execute({ reported_id, type }: IRequest): Promise<void> {
    let reports = [] as Report[];

    if (type === 'host') {
      reports = await this.reportsRepository.findAllByHostId(reported_id);
    } else {
      reports = await this.reportsRepository.findAllByExperienceId(reported_id);
    }

    const adminConfigure = await this.adminConfigureRepository.findLatest();

    if (!adminConfigure) {
      throw new AppError('AdminConfigure was not found!');
    }

    const unresolvedReports = reports.filter(report => {
      if (!report.is_resolved) {
        return report;
      }
      return;
    })

    if (reports.length >= unresolvedReports.length) {
      const host = await this.usersRepository.findByHostId(reports[0].host.id);

      if (!host) {
        throw new AppError('Host does not exists');
      }

      host.status = statusEnum.analyzing;

      await this.usersRepository.update(host);

      const admins = await this.usersRepository.findAllAdmins();

      if (type === 'exp') {
        const experience = await this.experiencesRepository.findById(reported_id);

        if (!experience) {
          throw new AppError('Experience does not exists');
        }

        experience.is_blocked = true;

        await this.experiencesRepository.update(experience);

        const appointmentsOfExperience = await this.appointmentsRepository.findByExperienceId(experience.id);

        for (const appointment of appointmentsOfExperience) {
          await this.notificationsRepository.create({
            title: 'Problemas com agendamento',
            message:
              `A Experiência "${appointment.schedule.experience.name}" está em análise por conta de ` +
              `um excesso de denúncias que ela recebeu. Verifique se deseja manter o agendamento`,
            receiver_id: appointment.user.id,
            appointment_id: appointment.id,
            host_id: host.host.id,
            exp_id: appointment.schedule.experience.id,
            schedule_id: appointment.schedule.id
          })
        }

        for (const admin of admins) {
          await this.notificationsRepository.create({
            title: 'Experiência bloqueada',
            message:
              `A Experiência "${experience.name}" está em bloqueada por conta de ` +
              `um excesso de denúncias que ela recebeu.`,
            receiver_id: admin.id,
            host_id: host.host.id,
            exp_id: experience.id
          })
        }
      }

      const appointments = await this.appointmentsRepository.findByHostId(reports[0].host.id);

      for (const appointment of appointments) {
        await this.notificationsRepository.create({
          title: 'Problemas com agendamento',
          message:
            `O Anfitrião da experiência "${appointment.schedule.experience.name}" está em análise por conta de ` +
            `um excesso de denúncias que ele recebeu. Verifique se deseja manter o agendamento`,
          receiver_id: appointment.user.id,
          appointment_id: appointment.id,
          host_id: host.host.id,
          exp_id: appointment.schedule.experience.id,
          schedule_id: appointment.schedule.id
        })
      }

      for (const admin of admins) {
        await this.notificationsRepository.create({
          title: 'Anfitrião em análise',
          message:
            `O Anfitrião "${host.host.nickname}" está em análise por conta de ` +
            `um excesso de denúncias que ele recebeu.`,
          receiver_id: admin.id,
          host_id: host.host.id,
        })
      }
    }
  }
}

export default ManageReportsService;
