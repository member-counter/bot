
import mongoose from 'mongoose';
import getEnv from './utils/getEnv';

const { DB_URI } = getEnv();

const startDBClient = () => {
  // Mongoose connection
  mongoose
    .connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log('[Mongoose] Connection ready');
    })
    .catch(console.error);

}

export default startDBClient;