import Review from "../infra/typeorm/entities/Review";
import ICreateReviewDTO from "../dtos/ICreateReviewDTO";

export default interface IReviewsRepository {
  create(data: ICreateReviewDTO): Promise<Review>;
  findById(id: number): Promise<Review | undefined>;
  update(review: Review): Promise<Review>;
  findByHostId(host_id: number): Promise<Review[]>;
  findByExpId(exp_id: number): Promise<Review[]>;
}
