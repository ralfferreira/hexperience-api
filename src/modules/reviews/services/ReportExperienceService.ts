import { inject, injectable } from "tsyringe";

import AppError from "@shared/errors/AppError";

import IExperiencesRepository from "@modules/experiences/repositories/IExperiencesRepository";
import INotificationsRepository from "@modules/notifications/repositories/INotificationsRepository";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";

import Review from "../infra/typeorm/entities/Review";
import IReviewsRepository from "../repositories/IReviewsRepository";

interface IRequest {
  comment: string;
  reason: string;
  user_id: number;
  exp_id: number;
}

@injectable()
class ReportExperienceService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ExperiencesRepository')
    private experiencesRepository: IExperiencesRepository,

    @inject('ReviewsRepository')
    private reviewsRepository: IReviewsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository
  ) {}

  public async execute({ comment, reason, user_id, exp_id }: IRequest): Promise<Review> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    const experience = await this.experiencesRepository.findById(exp_id);

    if (!experience) {
      throw new AppError('Experience does not exists');
    }

    const report = await this.reviewsRepository.createReport({
      comment,
      reason,
      host: experience.host,
      experience: experience
    });

    const admins = await this.usersRepository.findAllAdmins();

    for (const admin of admins) {
      await this.notificationsRepository.create({
        title: 'Nova denúcia recebida',
        message:
          `A experiência ${experience.name} do anfitrião ${experience.host.nickname} ` +
          `recebeu uma nova denúnica. Verifique a denúncia e avalie o caso.`,
        receiver_id: admin.id,
      });
    }

    await this.notificationsRepository.create({
      title: 'Experiência reportada',
      message:
        `Sua experiência ${experience.name} foi reportada. ` +
        `Verifique qual foi denúncia.`,
      receiver_id: experience.host.id,
      exp_id: experience.id,
      host_id: experience.host.id
    })

    return report;
  }
}

export default ReportExperienceService;
