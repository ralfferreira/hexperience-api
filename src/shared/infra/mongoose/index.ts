import mongoConfig from '@config/mongo';
import mongoose from 'mongoose';

async function run(): Promise<void> {
  await mongoose.connect(mongoConfig.uri, mongoConfig.options).catch(() => {
    throw new Error('Unable to connect to schemas database');
  });

  console.log('Schemas database is connected');
}

run();
