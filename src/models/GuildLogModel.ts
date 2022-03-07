import { model, Schema, HydratedDocument } from "mongoose";

interface GuildLog {
	id: string;
	text: string;
	timestamp: Date;
}

type GuildLogDocument = HydratedDocument<GuildLog>;

const GuildLogSchema = new Schema<GuildLog>({
	id: { type: String, require: true },
	text: { type: String, require: true },
	timestamp: { type: Date, default: Date.now, required: true }
});

const GuildLogModel = model<GuildLog>("guildLogs", GuildLogSchema);
export { GuildLogModel, GuildLogDocument };
export default GuildLogModel;
