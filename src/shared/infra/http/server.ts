import "reflect-metadata";
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import 'express-async-errors';

import envConfig from "@config/env";

global.env = envConfig;

import storageConfig from '@config/storage';
import AppError from "../../errors/AppError";
import routes from './routes';

import '../typeorm';
import '../mongoose';
import '../../container';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(storageConfig.uploadsFolder));
app.use(routes);

app.use(errors());

app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  console.error();

  return response.status(500).json({
    status: 'error',
    message: 'Internal Server Error'
  });
})

app.listen(3333, () => {
  console.log('Hexperience server online on port 3333!');
})
