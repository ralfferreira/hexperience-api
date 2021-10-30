export default interface ICreateUserDTO {
  name: string;
  email: string;
  phone_number?: string;
  password: string;
  token?: string;
}
