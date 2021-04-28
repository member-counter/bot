import { model, Schema, Document } from "mongoose";

interface GuildCountCacheDocument extends Document {
	guild: string;
	members: number;
	onlineMembers: number;
	timestamp: number;
}

const GuildCountCacheSchema = new Schema({
	guild: { type: String, require: true },
	members: { type: Number, require: true },
	onlineMembers: { type: Number, require: true },
	timestamp: { type: Number, require: true, default: Date.now }
});

const GuildCountCacheModel = model<GuildCountCacheDocument>(
	"guildCountCache",
	GuildCountCacheSchema
);

export { GuildCountCacheModel, GuildCountCacheDocument };
export default GuildCountCacheModel;
