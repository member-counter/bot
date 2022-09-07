import { Document, model, Schema } from "mongoose";

interface GuildSettingsDocument extends Document {
	id: string;
	locale: string;
}

const GuildSchema = new Schema({
	id: { type: String, require: true },
	locale: { type: String }
});

const GuildModel = model<GuildSettingsDocument>("guildSettings", GuildSchema);

export { GuildModel, GuildSettingsDocument };
export default GuildModel;
