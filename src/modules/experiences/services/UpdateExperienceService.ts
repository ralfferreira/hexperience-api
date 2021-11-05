import { inject, injectable } from "tsyringe";
import isAfter from "date-fns/isAfter";

import AppError from "@shared/errors/AppError";

import Experience from "../infra/typeorm/entities/Experience";

import IExperiencesRepository from "../repositories/IExperiencesRepository";
import INotificationsRepository from "@modules/notifications/repositories/INotificationsRepository";
import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentsRepository";
import ICategoriesRepository from "../repositories/ICategoriesRepository";

interface IRequest {
  id: number;
  name: string;
  duration: number;
  description: string;
  price: number;
  requirements: string;
  parental_rating: number;
  max_guests: number;
  address: string;
  latitude: number;
  longitude: number;
  is_online: boolean;
  hidden: boolean;
  category_id: number;
  host_id: number;
}

@injectable()
class UpdateExperienceService {
  constructor (
    @inject('ExperiencesRepository')
    private experiencesRepository: IExperiencesRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository
  ) {}

  public async execute({
    id,
    host_id,
    address,
    description,
    duration,
    is_online,
    latitude,
    longitude,
    name,
    max_guests,
    parental_rating,
    price,
    requirements,
    hidden,
    category_id
  }: IRequest): Promise<Experience> {
    const experience = await this.experiencesRepository.findById(id);

    if (!experience) {
      throw new AppError('Experience does not exists');
    }

    if (experience.host.id !== host_id) {
      throw new AppError('Host does not own this experience');
    }

    if (experience.is_blocked) {
      throw new AppError('You can not update a blocked experience');
    }

    if (duration > 360) {
      throw new AppError('Experience can not last more than 6 hours');
    }

    const category = await this.categoriesRepository.findById(category_id);

    if (!category) {
      throw new AppError('Category does not exists');
    }

    const appointments = await this.appointmentsRepository.findByExperienceId(experience.id);

    const futureAppointments = appointments.filter(a => {
      if (isAfter(a.schedule.date, new Date())) {
        return a;
      }
    });

    for (const appointment of futureAppointments) {
      await this.notificationsRepository.create({
        title: 'Alterações em Experiência agendada',
        message:
          'Houve alterações nos detalhes de uma experiência que você agendou. ' +
          'Verifique o que foi alterado e se ainda tem interesse na experiência após as mudanças',
        receiver_id: appointment.user.id,
        schedule_id: appointment.schedule.id,
        appointment_id: appointment.id,
        exp_id: experience.id,
        host_id: host_id
      });
    }

    experience.name = name;
    experience.duration = duration;
    experience.description = description;
    experience.price = price;
    experience.requirements = requirements;
    experience.parental_rating = parental_rating;
    experience.address = address;
    experience.latitude = latitude;
    experience.longitude = longitude;
    experience.is_online = is_online;
    experience.max_guests = max_guests;
    experience.hidden = hidden;
    experience.category = category;

    const updatedExperience = await this.experiencesRepository.update(experience);

    return updatedExperience;
  }
}

export default UpdateExperienceService;
