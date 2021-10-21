import mongoose, { Schema, Document } from "mongoose";

export type UserTokenType = Document & {
  token: string;
  user_id: number;
  createdAt: Date;
  updatedAt: Date;
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

UserTokensSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7200 });

export default mongoose.model<UserTokenType>(
  'User_token',
  UserTokensSchema
);
