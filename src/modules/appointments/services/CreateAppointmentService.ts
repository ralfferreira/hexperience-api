import { inject, injectable } from "tsyringe";
import { format, isBefore } from 'date-fns';

import AppError from "@shared/errors/AppError";

import Appointment from "../infra/typeorm/entities/Appointment";

import ISchedulesRepository from "@modules/experiences/repositories/ISchedulesRepository";
import IAppointmentsRepository from "../repositories/IAppointmentsRepository";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import IHostsRepository from "@modules/users/repositories/IHostsRepository";
import INotificationsRepository from "@modules/notifications/repositories/INotificationsRepository";

import { statusEnum as userStatusEnum } from "@modules/users/infra/typeorm/entities/User";
import { statusEnum as appointmentStatusEnum } from '../infra/typeorm/entities/Appointment';

interface IRequest {
  guests: number;
  status: string;
  user_id: number;
  schedule_id: number;
}

@injectable()
class CreateAppointmentService {
  constructor (
    @inject('SchedulesRepository')
    private schedulesRepository: ISchedulesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HostsRepository')
    private hotstsRepository: IHostsRepository,

    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository
  ) {}

  public async execute({
    guests,
    status,
    schedule_id,
    user_id
  }: IRequest): Promise<Appointment> {
    const schedule = await this.schedulesRepository.findById(schedule_id);

    if (!schedule) {
      throw new AppError('Horário para agendamento não existe');
    }

    if (schedule.experience.is_blocked) {
      throw new AppError('Experiências bloqueadas não podem receber novos agendamentos')
    }

    if (isBefore(schedule.date, new Date())) {
      throw new AppError('Agendamento não pode ser feito num horário que já passou');
    }

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Usuário não existe');
    }

    if (user.status === userStatusEnum.blocked) {
      throw new AppError('Usuários bloqueados não podem fazer agendamentos');
    }

    const host = await this.hotstsRepository.findById(schedule.experience.host.id);

    if (!host) {
      throw new AppError('Anfitrião não existe');
    }

    if (user.id === host.user.id) {
      throw new AppError('Usuário não pode agendar um horário em uma experiência oferecida por ele mesmo');
    }

    if (guests > schedule.availability) {
      throw new AppError('Horário para agendamento não possui disponibilidade para esse número de pessoas')
    }

    schedule.availability -= guests;

    const updatedSchedule = await this.schedulesRepository.update(schedule);

    const finalPrice = guests * schedule.experience.price;

    const paymentStatus = status as appointmentStatusEnum;

    const appointment = await this.appointmentsRepository.create({
      final_price: finalPrice,
      guests,
      status: paymentStatus,
      schedule: updatedSchedule,
      user: user
    });

    const formattedDate = format(schedule.date, "dd/MM/yyyy 'às' HH:mm'h'");

    await this.notificationsRepository.create({
      title: 'Novo agendamento',
      message:
        `Um novo agendamento foi feito na experiência: "${schedule.experience.name}". ` +
        `O agendamento foi marcado para ${formattedDate}.`,
      receiver_id: host.user.id,
      appointment_id: appointment.id,
      exp_id: schedule.experience.id,
      schedule_id: schedule.id
    })

    return appointment;
  }
}

export default CreateAppointmentService;
