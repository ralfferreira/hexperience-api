import mongoose, { Schema, Document } from 'mongoose';

export type AppBugType = Document & {
  where: string;
  what: string;
  description: string;
  resolved: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const AppBugSchema = new Schema(
  {
    where: { type: String, required: true },
    what: { type: String, required: true },
    description: { type: String, required: true },
    resolved: { type: Boolean, required: true, default: false }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<AppBugType>(
  'App_bug',
  AppBugSchema
);
