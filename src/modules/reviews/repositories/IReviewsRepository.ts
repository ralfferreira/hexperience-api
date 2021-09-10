import Review from "../infra/typeorm/entities/Review";
import ICreateReviewDTO from "../dtos/ICreateReviewDTO";
import ICreateReportDTO from "../dtos/ICreateReportDTO";

export default interface IReviewsRepository {
  createReview(data: ICreateReviewDTO): Promise<Review>;
  createReport(data: ICreateReportDTO): Promise<Review>;
}
