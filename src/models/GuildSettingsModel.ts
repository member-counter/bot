import { Document, model, Schema } from "mongoose";

export type shortNumber = 1 | -1;
interface GuildSettingsDocument extends Document {
	id: string;
	locale: string;
	shortNumber: shortNumber;
}

const GuildSchema = new Schema({
	id: { type: String, require: true },
	locale: { type: String },
	shortNumber: { type: Number, default: 1 }
});

const GuildModel = model<GuildSettingsDocument>("guildSettings", GuildSchema);

export { GuildModel, GuildSettingsDocument };
export default GuildModel;
