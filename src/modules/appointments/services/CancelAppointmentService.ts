import { inject, injectable } from "tsyringe";
import { format, isBefore } from "date-fns";

import AppError from "@shared/errors/AppError";

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IAppointmentsRepository from "../repositories/IAppointmentsRepository";
import INotificationsRepository from "@modules/notifications/repositories/INotificationsRepository";
import ISchedulesRepository from "@modules/experiences/repositories/ISchedulesRepository";
import { statusEnum } from "../infra/typeorm/entities/Appointment";

interface IRequest {
  appointment_id: number;
  user_id: number;
}

@injectable()
class CancelAppointmentService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('SchedulesRepository')
    private schedulesRepository: ISchedulesRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository
  ) {}

  public async execute({ user_id, appointment_id }: IRequest): Promise<void> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Usuário não existe');
    }

    const appointment = await this.appointmentsRepository.findById(appointment_id);

    if (!appointment) {
      throw new AppError('Agendamento não existe');
    }

    if (appointment.user.id !== user.id) {
      throw new AppError('Usuário não pode cancelar agendamento que não foi marcado por ele mesmo');
    }

    const schedule = await this.schedulesRepository.findById(appointment.schedule.id);

    if (!schedule) {
      throw new AppError('Horário para agendamento não existe');
    }

    if (isBefore(schedule.date, new Date())) {
      throw new AppError('Usuário não pode cancelar um agendamento que já aconteceu');
    }

    const formattedDate = format(schedule.date, "dd/MM/yyyy 'às' HH:mm'h'");

    schedule.availability += appointment.guests;

    await this.schedulesRepository.update(schedule);

    const receiver = await this.usersRepository.findByHostId(schedule.experience.host.id);

    if (!receiver) {
      throw new AppError('Anfitrião não existe');
    }

    if (appointment.status === statusEnum.paid) {
      appointment.status = statusEnum.refund;

      await this.appointmentsRepository.cancel(appointment);

      await this.notificationsRepository.create({
        title: 'Agendamento cancelado',
        message:
          `Seu agendamento na experiência "${appointment.schedule.experience.name}", ` +
          `no dia ${formattedDate}, foi cancelado e em breve será reembolsado.`,
        receiver_id: receiver.id,
        appointment_id: appointment.id,
        exp_id: schedule.experience.id,
        host_id: schedule.experience.host.id,
        schedule_id: schedule.id
      });
    } else {
      await this.appointmentsRepository.delete(appointment.id);

      await this.notificationsRepository.create({
        title: 'Agendamento cancelado',
        message:
          `Seu agendamento na experiência "${appointment.schedule.experience.name}", ` +
          `no dia ${formattedDate}, foi cancelado.`,
        receiver_id: receiver.id,
        appointment_id: appointment.id,
        exp_id: schedule.experience.id,
        host_id: schedule.experience.host.id,
        schedule_id: schedule.id
      });
    }
  }
}

export default CancelAppointmentService;
