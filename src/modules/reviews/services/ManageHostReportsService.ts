import { inject, injectable } from "tsyringe";

import AppError from "@shared/errors/AppError";

import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import { statusEnum } from "@modules/users/infra/typeorm/entities/User";
import IReportsRepository from "../repositories/IReportsRepository";
import IAdminConfigureRepository from "@modules/admin/repositories/IAdminConfigureRepository";
import INotificationsRepository from "@modules/notifications/repositories/INotificationsRepository";
import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentsRepository";

@injectable()
class ManageHostReportsService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ReportsRepository')
    private reportsRepository: IReportsRepository,

    @inject('AdminConfigureRepository')
    private adminConfigureRepository: IAdminConfigureRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) {}

  public async execute(host_id: number): Promise<void> {
    const host = await this.usersRepository.findByHostId(host_id);

    if (!host) {
      throw new AppError('Host does not exists');
    }

    if (host.status !== statusEnum.ok) {
      console.log('Host status is analyzing');

      return;
    }

    const hostReports = await this.reportsRepository.findAllByHostId(host.host.id);

    const unresolvedReports = hostReports.filter(report => {
      if (!report.is_resolved) {
        return report;
      }
    });

    const adminConfigure = await this.adminConfigureRepository.findLatest();

    if (!adminConfigure) {
      throw new AppError('AdminConfigure does not exists!');
    }

    if (unresolvedReports.length < adminConfigure.reports_to_block) {
      console.log('There are no reports enough to block host');

      return;
    }

    const admins = await this.usersRepository.findAllAdmins();

    host.status = statusEnum.analyzing;

    await this.usersRepository.update(host);

    for (const admin of admins) {
      await this.notificationsRepository.create({
        title: 'Anfitrião em análise',
        message:
          `O anfitrião "${host.host.nickname}" está em análise por excesso de denúncias. ` +
          `Verifique o caso e tome as devidas providências.`,
        receiver_id: admin.id,
        host_id: host.id
      })
    }

    await this.notificationsRepository.create({
      title: 'Aviso de conduta suspeita',
      message:
        `Você foi colocado em análise por excesso de denúncias que recebeu. ` +
        `Verifique sua conduta.`,
      receiver_id: host.id
    })

    const allHostAppointments = await this.appointmentsRepository.findByHostId(host.host.id);

    for (const appointment of allHostAppointments) {
      await this.notificationsRepository.create({
        title: 'Anfitrião em análise',
        message:
          `O anfitrião da experiência "${appointment.schedule.experience.name}" que ` +
          `você agendou está em análise por excesso de denúncias. ` +
          `Verifique se deseja manter o agendamento`,
        receiver_id: appointment.user.id,
        appointment_id: appointment.id,
        exp_id: appointment.schedule.experience.id,
        host_id: host.host.id,
        schedule_id: appointment.schedule.id
      });
    }
  }
}

export default ManageHostReportsService;
