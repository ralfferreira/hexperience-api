import mongoose, { Schema, Document } from 'mongoose';

export type AccountVerificationType = Document & {
  name: string;
  email: string;
  password: string;
  token: string;
  createdAt: Date;
  updatedAt: Date;
};

const AccountVerificationsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      unique: true,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

AccountVerificationsSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7200 });

export default mongoose.model<AccountVerificationType>(
  'Account_verfication',
  AccountVerificationsSchema
);
