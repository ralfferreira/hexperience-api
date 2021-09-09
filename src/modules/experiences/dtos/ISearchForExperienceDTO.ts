export default interface ISearchForExperienceDTO {
  name?: string;
  min_duration?: number;
  max_duration?: number;
  min_price?: number;
  max_price?: number;
  parental_rating?: number;
  is_online?: boolean;
  host_id?: number;
}
