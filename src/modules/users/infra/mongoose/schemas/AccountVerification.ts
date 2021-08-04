import mongoose, { Schema, Document } from 'mongoose';

export type AccountVerification = Document & {
  name: string,
  email: string,
  password: string,
  token: string
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
      required: true
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