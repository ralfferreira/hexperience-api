import mongoose, { Schema, Document } from "mongoose";

export type UserToken = Document & {
  token: string;
  user_id: number;
}

const UserTokenSchema = new Schema(
  {
    token: {
      type: String,
      unique: true,
      required: true,      
    },
    user_id: {
      type: Number,
      unique: true,
      required: true
    },    
  },
  {
    timestamps: true,      
  }
);

export default mongoose.model<UserToken>(
  'User_token',
  UserTokenSchema
);
