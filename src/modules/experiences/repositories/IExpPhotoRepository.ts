import ICreateExpPhotoDTO from "../dtos/ICreateExpPhotoDTO";
import ExpPhoto from "../infra/typeorm/entities/ExpPhoto";

export default interface IExpPhotoRepository {
  create(data: ICreateExpPhotoDTO): Promise<ExpPhoto>;
  findAllByExpId(exp_id: number): Promise<ExpPhoto[]>;
  update(photo: ExpPhoto): Promise<ExpPhoto>;
}
