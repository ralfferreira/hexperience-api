import { inject, injectable } from "tsyringe";

import AppError from "@shared/errors/AppError";

import IHostsRepository from '@modules/users/repositories/IHostsRepository';
import ISchedulesRepository from '@modules/experiences/repositories/ISchedulesRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import isBefore from "date-fns/isBefore";
import { statusEnum } from "@modules/appointments/infra/typeorm/entities/Appointment";

interface IRequest {
  schedule_id: number;
  host_id: number;
}

@injectable()
class CancelScheduleService {
  constructor (
    @inject('HostsRepository')
    private hostsRepository: IHostsRepository,

    @inject('SchedulesRepository')
    private schedulesRepository: ISchedulesRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('AppointmentsRepository')
    private appointmentsRespository: IAppointmentsRepository
  ) {}

  public async execute({ host_id, schedule_id }: IRequest): Promise<void> {
    const host = await this.hostsRepository.findById(host_id);

    if (!host) {
      throw new AppError('Anfitrião não existe');
    }

    const schedule = await this.schedulesRepository.findById(schedule_id);

    if (!schedule) {
      throw new AppError('Horário para agendamento não existe');
    }

    if (isBefore(schedule.date, new Date())) {
      throw new AppError('Não é possivel cancelar um horário para agendamento que já ocorreu');
    }

    if (schedule.experience.host.id !== host.id) {
      throw new AppError('Anfitrião não controla esse horário');
    }

    const scheduleAppointments = await this.appointmentsRespository.findByScheduleId(schedule.id);

    if (scheduleAppointments) {
      for (const appointment of scheduleAppointments) {
        await this.notificationsRepository.create({
          title: 'Agendamento cancelado',
          message:
            `Seu agendamento na experiência "${schedule.experience.name}", ` +
            `foi cancelado pelo seu anfitrião.`,
          receiver_id: appointment.user.id,
          appointment_id: appointment.id,
          exp_id: schedule.experience.id,
          host_id: host.id,
          schedule_id: schedule.id
        });

        if (appointment.status === statusEnum.paid) {
          appointment.status = statusEnum.refund;

          await this.appointmentsRespository.cancel(appointment);
        } else {
          await this.appointmentsRespository.delete(appointment.id);
        }
      }
    }

    await this.schedulesRepository.delete(schedule.id);
  }
}

export default CancelScheduleService;
