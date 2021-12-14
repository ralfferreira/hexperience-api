import { Connection, createConnection } from 'typeorm';

createConnection(global.env.RDB_CONNECTION).then((value: Connection) => {
  console.log('Entities database is connected');
}).catch(() => {
  throw new Error('Unable to connect to entities database');
});
