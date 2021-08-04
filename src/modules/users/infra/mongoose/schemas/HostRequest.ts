import mongoose, { Schema, Document } from 'mongoose';

export type HostRequest = Document & {
  cpf?: string;
  cnpj?: string;
  nickname: string;
  user_id: number;
}

const HostRequestSchema = new Schema(
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

export default mongoose.model<HostRequest>(
  'Host_request',
  HostRequestSchema
);