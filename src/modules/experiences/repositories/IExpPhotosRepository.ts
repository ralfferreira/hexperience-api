import ICreateExpPhotoDTO from "../dtos/ICreateExpPhotoDTO";
import ExpPhoto from "../infra/typeorm/entities/ExpPhoto";

export default interface IExpPhotosRepository {
  create(data: ICreateExpPhotoDTO): Promise<ExpPhoto>;
  findAllByExpId(exp_id: number): Promise<ExpPhoto[]>;
  update(photo: ExpPhoto): Promise<ExpPhoto>;
  findById(id: number): Promise<ExpPhoto | undefined>;
  delete(photo: ExpPhoto): Promise<void>;
}
