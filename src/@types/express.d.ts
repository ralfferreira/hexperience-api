import User from '../modules/users/infra/typeorm/entities/User';

declare global {
  namespace Express {
    interface Request {
      user: {
        id: number;
        type: string;
        hostId: number;
      }
    }
  }
}
