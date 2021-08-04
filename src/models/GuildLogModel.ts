import { model, Schema, Document } from "mongoose";

interface GuildLogDocument extends Document {
	id: string;
	text: string;
	timestamp: Date;
}

const GuildLogSchema = new Schema({
	id: { type: String, require: true },
	text: { type: String, require: true },
	timestamp: { type: Date, default: Date.now, required: true }
});

const GuildLogModel = model<GuildLogDocument>("guildLogs", GuildLogSchema);
export { GuildLogModel, GuildLogDocument };
export default GuildLogModel;
