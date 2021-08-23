import mongoose, { Schema, Document } from 'mongoose';

export type AccountVerifications = Document & {
  name: string,
  email: string,
  password: string,
  token: string
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

export default mongoose.model<AccountVerifications>(
  'Account_verfication',
  AccountVerificationsSchema
);
