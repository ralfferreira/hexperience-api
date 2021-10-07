import Experience from "../infra/typeorm/entities/Experience";

export default interface ICreateExpPhotoDTO {
  photo: string;
  experience: Experience
}
