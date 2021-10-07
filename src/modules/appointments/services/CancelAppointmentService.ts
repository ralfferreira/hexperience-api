import { inject, injectable } from "tsyringe";
import { format, isBefore } from "date-fns";

import AppError from "@shared/errors/AppError";

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IAppointmentsRepository from "../repositories/IAppointmentsRepository";
import INotificationsRepository from "@modules/notifications/repositories/INotificationsRepository";
import ISchedulesRepository from "@modules/experiences/repositories/ISchedulesRepository";

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
      throw new AppError('User does not exists');
    }

    const appointment = await this.appointmentsRepository.findById(appointment_id);

    if (!appointment) {
      throw new AppError('Appointment does not exists');
    }

    if (appointment.user.id !== user.id) {
      throw new AppError('You can not cancel an appointment that is not yours');
    }

    const schedule = await this.schedulesRepository.findById(appointment.schedule.id);

    if (!schedule) {
      throw new AppError('Schedule does not exists');
    }

    if (isBefore(schedule.date, new Date())) {
      throw new AppError('You can not cancel an appointment that already happened');
    }

    const formattedDate = format(schedule.date, "dd/MM/yyyy 'às' HH:mm'h'");

    schedule.availability += appointment.guests;

    await this.schedulesRepository.update(schedule);

    const receiver = await this.usersRepository.findByHostId(schedule.experience.host.id);

    if (!receiver) {
      throw new AppError('Host does not exists');
    }

    await this.appointmentsRepository.delete(appointment.id);

    await this.notificationsRepository.create({
      title: 'Agendamento cancelado',
      message:
        `Um agendamento na sua experiência "${appointment.schedule.experience.name}", ` +
        `no dia ${formattedDate}, foi cancelado.`,
      receiver_id: receiver.id,
      appointment_id: appointment.id,
      exp_id: schedule.experience.id,
      host_id: schedule.experience.host.id,
      schedule_id: schedule.id
    });
  }
}

export default CancelAppointmentService;
