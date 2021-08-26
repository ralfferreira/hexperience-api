import mongoose, { Schema, Document } from "mongoose";

export type Notifications = Document & {
  title: string;
  message: string;
  receiver_id: number;
  exp_id?: number;
  host_id?: number;
  schedule_id?: number;
  appointment_id?: number;
};

const NotificationsSchema = new Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    receiver_id: { type: Number, required: true },
    exp_id: { type: Number, required: false },
    host_id: { type: Number, required: false },
    schedule_id: { type: Number, required: false },
    appointment_id: { type: Number, required: false }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<Notifications>(
  'Notification',
  NotificationsSchema
);
