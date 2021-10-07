export default interface ICreateNotificationDTO {
  title: string;
  message: string;
  receiver_id: number;
  exp_id?: number;
  host_id?: number;
  schedule_id?: number;
  appointment_id?: number;
}
