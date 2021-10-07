import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import authConfig from '@config/auth';

import AppError from "@shared/errors/AppError";

interface ITokenPayload {
  iat: number,
  exp: number,
  sub: string,
  hostId: number,
  type: string
}

export default function ensureAdminAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): void {

  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub, type, hostId } = decoded as ITokenPayload

    if (type !== 'admin') {
      throw new AppError('User is not an Admin');
    }

    request.user = {
      id: Number(sub),
      type,
      hostId,
    }

    return next();
  } catch {
    throw new AppError('Invalid JWT token', 401);
  }
}
