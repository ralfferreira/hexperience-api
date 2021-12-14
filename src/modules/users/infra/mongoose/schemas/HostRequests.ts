import mongoose, { Schema, Document } from 'mongoose';

export type HostRequestType = Document & {
  cpf?: string;
  cnpj?: string;
  nickname: string;
  user_id: number;
  createdAt: Date;
  updatedAt: Date;
}

const HostRequestsSchema = new Schema(
  {
    cpf: {
      type: String,
      unique: true
    },
    cnpj: {
      type: String,
      unique: true
    },
    nickname: {
      type: String,
      unique: true,
      required: true
    },
    user_id: {
      type: Number,
      unique: true,
      required: true
    }
  },
  {
    timestamps: true
  }
);

HostRequestsSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7200 });

export default mongoose.model<HostRequestType>(
  'Host_request',
  HostRequestsSchema
);
