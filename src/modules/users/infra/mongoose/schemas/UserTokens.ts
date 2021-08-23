import mongoose, { Schema, Document } from "mongoose";

export type UserTokens = Document & {
  token: string;
  user_id: number;
}

const UserTokensSchema = new Schema(
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

export default mongoose.model<UserTokens>(
  'User_token',
  UserTokensSchema
);
