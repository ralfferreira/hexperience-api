import { inject, injectable } from "tsyringe";

import AppError from "@shared/errors/AppError";

import Review from "../infra/typeorm/entities/Review";

import IReviewsRepository from "../repositories/IReviewsRepository";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import IExperiencesRepository from "@modules/experiences/repositories/IExperiencesRepository";
import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentsRepository";
import { isBefore } from "date-fns";

interface IRequest {
  comment: string;
  rating: number;
  user_id: number;
  exp_id: number;
}

@injectable()
class ReviewExperienceService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ExperiencesRepository')
    private experiencesRepository: IExperiencesRepository,

    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('ReviewsRepository')
    private reviewsRepository: IReviewsRepository
  ) {}

  public async execute({ comment, rating, user_id, exp_id }: IRequest): Promise<Review> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    const experience = await this.experiencesRepository.findById(exp_id);

    if (!experience) {
      throw new AppError('Experience does not exists');
    }

    const userAppointments = await this.appointmentsRepository.findByUserId(user_id);

    if (!userAppointments.length) {
      throw new AppError('User can not review an experience that he never scheduled');
    }

    const filteredUserAppointments = userAppointments.filter(appointment => {
      if (
        appointment.schedule.experience.id === experience.id &&
        isBefore(appointment.schedule.date, new Date())
      ) {
        return appointment;
      }
    });

    if (!filteredUserAppointments.length) {
      throw new AppError('User can not review an experience that he never scheduled');
    }

    const review = await this.reviewsRepository.create({
      comment,
      rating,
      user: user,
      experience: experience,
      host: experience.host
    });

    return review;
  }
}

export default ReviewExperienceService;
