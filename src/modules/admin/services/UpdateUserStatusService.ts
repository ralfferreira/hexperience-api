import { inject, injectable } from "tsyringe";
import { format, add } from "date-fns";
import path from 'path';

import AppError from "@shared/errors/AppError";

import User, { statusEnum, typeEnum } from "@modules/users/infra/typeorm/entities/User";

import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import INotificationsRepository from "@modules/notifications/repositories/INotificationsRepository";
import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentsRepository";
import IMailProvider from "@shared/container/providers/MailProvider/models/IMailProvider";
import IAdminConfigureRepository from "../repositories/IAdminConfigureRepository";

interface IRequest {
  user_id: number;
  status: string;
}

@injectable()
class UpdateUserStatusService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('AdminConfigureRepository')
    private adminConfigureRepository: IAdminConfigureRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({ user_id, status }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    const newStatus = status as statusEnum;

    if (user.status === newStatus) {
      return user;
    }

    user.status = newStatus;

    await this.usersRepository.update(user);

    switch (newStatus) {
      case statusEnum.ok: {
        await this.notificationsRepository.create({
          title: 'Fim do processo de análise',
          message:
            `O processo de análise das denúncias que você recebeu acabou e ` +
            `aparentemente está tudo ok. Agradecemos a paciência.`,
          receiver_id: user.id,
        });

        break;
      }

      case statusEnum.analyzing: {
        await this.notificationsRepository.create({
          title: 'Aviso de processo de análise',
          message:
            `Você foi colocado em análise por excesso de denúncias que recebeu. ` +
            `Verifique sua conduta.`,
          receiver_id: user.id
        });

        if (user.type === typeEnum.host) {
          const allHostAppointments = await this.appointmentsRepository.findByHostId(user.host.id);

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
              host_id: user.host.id,
              schedule_id: appointment.schedule.id
            });
          }
        }

        break;
      }

      case statusEnum.blocked: {
        const adminConfigure = await this.adminConfigureRepository.findLatest();

        if (!adminConfigure) {
          throw new AppError('AdminConfigure does not exists');
        }

        let templateName = 'blocked_host_warning.hbs';

        if (user.type === typeEnum.user) {
          templateName = 'blocked_user_warning.hbs'
        }

        const unlockDate = format(
          add(user.updated_at, { days: adminConfigure.days_blocked }),
          "dd/MM/yyyy 'às' HH:mm'h'"
        );

        const blockedWarningTemplate = path.resolve(
          __dirname,
          '..',
          'views',
          templateName
        );

        await this.mailProvider.sendMail({
          to: {
            name: user.name,
            email: user.email
          },
          subject: '[Hexperience] Aviso de bloqueio de conta',
          templateData: {
            file: blockedWarningTemplate,
            variables: {
              name: user.name,
              days_blocked: adminConfigure.days_blocked,
              unlock_date: unlockDate
            }
          }
        });

        break;
      }
    }

    return user;
  }
}

export default UpdateUserStatusService;
