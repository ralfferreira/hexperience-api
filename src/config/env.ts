import dotenv from 'dotenv';

dotenv.config();

export interface IEnviromentVariable {
  [key: string]: string;
}

function setUp(): IEnviromentVariable {
  const env = process.env.NODE_ENV!;

  let config = {
    ENV: env,
    APP_SECRET: process.env.APP_SECRET!
  } as IEnviromentVariable

  if (env !== 'production') {
    Object.assign(config, {
      APP_API_URL: process.env.DEV_APP_API_URL!,
      MONGODB_URI: process.env.DEV_MONGODB_URI!,
      MAIL_DRIVER: process.env.DEV_MAIL_DRIVER!,
      STORAGE_DRIVER: process.env.DEV_STORAGE_DRIVER!,
    });
  } else {
    Object.assign(config, {
      APP_API_URL: process.env.DEV_APP_API_URL!,
      MONGODB_URI: process.env.DEV_MONGODB_URI!,
      MAIL_DRIVER: process.env.PROD_MAIL_DRIVER!,
      STORAGE_DRIVER: process.env.PROD_STORAGE_DRIVER!,
    });
  }

  return config;
}

const envConfig = setUp();

export default envConfig;
