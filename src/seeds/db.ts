import * as mongoose from 'mongoose';
import envConfig from '../config/env';

const db = mongoose.connect(envConfig.MONGODB_URL);

export default (await db).connection;
