import { model, Schema, Document, DocumentToObjectOptions } from 'mongoose';

interface GuildLog {
  guild?: string;
  text?: string;
	timestamp?: Date;
}

interface GuildLogDocument extends GuildLog, Document {
	toObject(options?: DocumentToObjectOptions): GuildLog;
}

const GuildLogSchema = new Schema({
  guild: { type: String, require: true },
	text: { type: String, require: true },
	timestamp: { type: Date, default: Date.now, required: true },
});

const GuildLogModel = model<GuildLogDocument>('guildLogs', GuildLogSchema);
export { GuildLogModel, GuildLogDocument, GuildLog };
export default GuildLogModel;
