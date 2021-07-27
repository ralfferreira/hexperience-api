import mongoose, { Schema, Document, Date } from 'mongoose';

export type AccountVerification = Document & {
  name: string,
  email: string,
  password: string,
  token: string,
  created_at: Date,
};

const AccountVerificationSchema = new Schema(
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
      required: true,
      default: 'ola'
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<AccountVerification>(
  'Account_verfication', 
  AccountVerificationSchema
);