interface IMongoConfig {
  uri: string,
  options: {
    [key: string]: string | number | boolean;
  }
}

export default {
  uri: global.env.MONGODB_URI,
  options: {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
    poolSize: 50,
    autoIndex: false,
    retryWrites: false
  }
} as IMongoConfig;

