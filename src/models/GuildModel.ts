import mongoose from 'mongoose';
import getEnv from '../utils/getEnv';

const { DISCORD_PREFIX } = getEnv();

const GuildSchema = new mongoose.Schema({
  guild: { type: String, require: true },
  premium: { type: Boolean, default: false },
  prefix: { type: String, default: DISCORD_PREFIX },
  language: { type: String, default: 'en_US' },
  allowedRoles: [{ type: String, default: [] }],
  counters: { type: Map, of: String, default: new Map() },
  shortNumber: { type: Boolean, default: false },
  digits: {
    type: Array,
    default: [
      '<a:0G:701869754616512672>',
      '<a:1G:701869754578894939>',
      '<a:2G:701869754641547324>',
      '<a:3G:701869754717175828>',
      '<a:4G:701869754880753824>',
      '<a:5G:701869754763182080>',
      '<a:6G:701869754641809529>',
      '<a:7G:701869754402734183>',
      '<a:8G:701869754356596869>',
      '<a:9G:701869754687815720>',
    ],
    require: true,
  },
});

const GuildModel = mongoose.model('guilds', GuildSchema);

export default GuildModel;
