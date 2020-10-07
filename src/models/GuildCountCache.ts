import { model, Schema, Document, DocumentToObjectOptions } from 'mongoose';

interface GuildCountCache {
  guild?: string;
  members?: number;
  onlineMembers?: number;
  timestamp?: number;
}

interface GuildCountCacheDocument extends GuildCountCache, Document {
	toObject(options?: DocumentToObjectOptions): GuildCountCache;
}


const GuildCountCacheSchema = new Schema({
  guild: { type: String, require: true },
  members: { type: Number, require: true },
  onlineMembers: { type: Number, require: true },
  timestamp: { type: Number, require: true, default: Date.now },
});

const GuildCountCacheModel = model<GuildCountCacheDocument>('guildCountCache', GuildCountCacheSchema);

export { GuildCountCacheModel, GuildCountCacheDocument, GuildCountCache };
export default GuildCountCacheModel;
