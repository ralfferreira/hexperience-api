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

export default function ensureAuthenticated(
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

    request.user = {
      id: Number(sub),
      type,
      hostId,
    }

    if(hostId === 0){
      throw new AppError('Only a host can create an experience.', 401)
    }

    return next();
  } catch {
    throw new AppError('Invalid JWT token', 401);
  }
}
