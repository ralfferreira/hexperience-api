import { inject, injectable } from "tsyringe";
import { format } from "date-fns";

import AppError from "@shared/errors/AppError";

import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentsRepository";
import IExperiencesRepository from "@modules/experiences/repositories/IExperiencesRepository";
import INotificationsRepository from "@modules/notifications/repositories/INotificationsRepository";
import { statusEnum, typeEnum } from "@modules/users/infra/typeorm/entities/User";

@injectable()
class ManageBlockedUserService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('ExperiencesRepository')
    private experiencesRepository: IExperiencesRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository
  ) {}

  public async execute(user_id: number): Promise<void> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    if (user.status !== statusEnum.blocked) {
      return;
    }

    const allUserAppointments = await this.appointmentsRepository.findByUserId(user.id);

    for (const userAppointment of allUserAppointments) {
      const experience = await this.experiencesRepository.findById(userAppointment.schedule.experience.id);

      if (!experience) {
        throw new AppError('Experience does not exists');
      }

      const formattedDate = format(userAppointment.schedule.date, "dd/MM/yyyy 'às' HH:mm'h'");

      await this.appointmentsRepository.delete(userAppointment.id);

      await this.notificationsRepository.create({
        title: 'Agendamento cancelado',
        message:
          `Um agendamento na sua experiência "${userAppointment.schedule.experience.name}", ` +
          `no dia ${formattedDate}, foi cancelado.`,
        receiver_id: experience.host.user.id,
        appointment_id: userAppointment.id,
        exp_id: experience.id,
        host_id: experience.host.id,
        schedule_id: userAppointment.schedule.id
      });
    }

    if (user.type !== typeEnum.host) {
      return;
    }

    const allHostExperiences = await this.experiencesRepository.findByHostId(user.host.id);

    for (const experience of allHostExperiences) {
      experience.is_blocked = true;

      await this.experiencesRepository.update(experience);

      const allAppointments = await this.appointmentsRepository.findByExperienceId(experience.id);

      for (const appointment of allAppointments) {
        await this.appointmentsRepository.delete(appointment.id);

        await this.notificationsRepository.create({
          title: 'Agendamento cancelado',
          message:
            `Segundo o anfitrião, seu agendamento na experiência "${experience.name}", ` +
            `foi cancelado por: "Anfitrião bloqueado da plataforma"`,
          receiver_id: appointment.user.id,
          appointment_id: appointment.id,
          exp_id: experience.id,
          host_id: experience.host.id,
          schedule_id: appointment.schedule.id
        });
      }
    }
  }
}

export default ManageBlockedUserService;
