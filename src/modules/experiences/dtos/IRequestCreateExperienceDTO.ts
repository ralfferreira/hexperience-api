export default interface IRequestCreateExperienceDTO {
  name: string;
  duration: number;
  description: string;
  price: number;
  requirements: string;
  parental_rating: number;
  address: string;
  latitude: number;
  longitude: number;
  is_online: boolean;
  host_id: number;
}
