import mongoConfig from '@config/mongo';
import mongoose from 'mongoose';

async function run(): Promise<void> {
  await mongoose.connect(mongoConfig.uri, mongoConfig.options);

  console.log('Mongoose was called');  
}

run();