import { inject, injectable } from "tsyringe";

import AppError from "@shared/errors/AppError";

import IHostsRepository from "@modules/users/repositories/IHostsRepository";
import IExperiencesRepository from "../repositories/IExperiencesRepository";
import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentsRepository";
import { statusEnum } from "@modules/appointments/infra/typeorm/entities/Appointment";
import INotificationsRepository from "@modules/notifications/repositories/INotificationsRepository";
import { format } from "date-fns";

interface IRequest {
  host_id: number;
  exp_id: number;
}

@injectable()
class DeleteExperienceService {
  constructor (
    @inject('HostsRepository')
    private hostsRepository: IHostsRepository,

    @inject('ExperiencesRepository')
    private experiencesRepository: IExperiencesRepository,

    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository
  ) {}

  public async execute({ exp_id, host_id }: IRequest): Promise<void> {
    const host = await this.hostsRepository.findById(host_id);

    if (!host) {
      throw new AppError('Anfitrião não existe');
    }

    const experience = await this.experiencesRepository.findById(exp_id);

    if (!experience) {
      throw new AppError('Experiência não existe');
    }

    if (experience.host.id !== host.id) {
      throw new AppError('Somente o criador de uma experiência pode deletar ela');
    }

    if (experience.is_blocked) {
      throw new AppError('Experiências bloqueadas não podem ser deletadas');
    }

    const appointments = await this.appointmentsRepository.findByExperienceId(experience.id);

    if (appointments.length) {
      for (const appointment of appointments) {
        const formattedDate = format(appointment.schedule.date, "dd/MM/yyyy 'às' HH:mm'h'");

        if (appointment.status === statusEnum.paid) {
          appointment.status = statusEnum.refund;

          await this.notificationsRepository.create({
            title: 'Agendamento cancelado',
            message:
              `Seu agendamento na experiencia ${experience.name} no dia ${formattedDate}` +
              ` foi cancelado e em breve será reembolsado`,
            receiver_id: appointment.user.id,
            appointment_id: appointment.id,
            exp_id: experience.id,
            host_id: host.id,
            schedule_id: appointment.schedule.id
          })

          await this.appointmentsRepository.cancel(appointment);
        } else {
          await this.notificationsRepository.create({
            title: 'Agendamento cancelado',
            message:
              `Seu agendamento na experiencia ${experience.name} no dia ${formattedDate}` +
              ` foi cancelado.`,
            receiver_id: appointment.user.id,
            appointment_id: appointment.id,
            exp_id: experience.id,
            host_id: host.id,
            schedule_id: appointment.schedule.id
          });

          await this.appointmentsRepository.delete(appointment.id);
        }
      }
    }

    await this.experiencesRepository.delete(exp_id);
  }
}

export default DeleteExperienceService;
