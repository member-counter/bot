import { Document, model, Schema } from "mongoose";

interface GuildSettingsDocument extends Document {
	id: string;
	premium: boolean;
	blocked: boolean;
	locale: string;
	shortNumber: boolean;
}

const GuildSchema = new Schema({
	id: { type: String, require: true },
	premium: { type: Boolean, default: false },
	blocked: { type: Boolean, default: false },
	locale: { type: String },
	shortNumber: { type: Boolean, default: true }
});

const GuildModel = model<GuildSettingsDocument>("guilds", GuildSchema);

export { GuildModel, GuildSettingsDocument };
export default GuildModel;
