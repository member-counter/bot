import { Document, model, Schema } from "mongoose";

export type shortNumber = 1 | -1;
interface GuildSettingsDocument extends Document {
	id: string;
	premium: boolean;
	locale: string;
	shortNumber: shortNumber;
}

const GuildSchema = new Schema({
	id: { type: String, require: true },
	premium: { type: Boolean, default: false },
	locale: { type: String },
	shortNumber: { type: Number, default: 1 }
});

const GuildModel = model<GuildSettingsDocument>("guildSettings", GuildSchema);

export { GuildModel, GuildSettingsDocument };
export default GuildModel;
