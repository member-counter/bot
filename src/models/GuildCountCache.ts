import { model, Schema, Document } from "mongoose";

interface GuildCountCacheDocument extends Document {
	id: string;
	members: number;
	onlineMembers: number;
	timestamp: Date;
}

const GuildCountCacheSchema = new Schema({
	id: { type: String, require: true },
	members: { type: Number, require: true },
	onlineMembers: { type: Number, require: true },
	timestamp: { type: Date, require: true, default: () => new Date() }
});

const GuildCountCacheModel = model<GuildCountCacheDocument>(
	"guildCountCache",
	GuildCountCacheSchema
);

export { GuildCountCacheModel, GuildCountCacheDocument };
export default GuildCountCacheModel;
