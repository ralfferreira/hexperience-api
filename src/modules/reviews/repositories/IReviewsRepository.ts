import Review from "../infra/typeorm/entities/Review";
import ICreateReviewDTO from "../dtos/ICreateReviewDTO";

export default interface IReviewsRepository {
  createReview(data: ICreateReviewDTO): Promise<Review>;
}
