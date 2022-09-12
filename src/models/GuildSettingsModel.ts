import { Document, model, Schema } from "mongoose";
import { availableLocales } from "../services/i18n/index";

interface GuildSettingsDocument extends Document {
	id: string;
	premium: boolean;
	blocked: boolean;
	language: typeof availableLocales[number];
	locale: string;
	shortNumber: boolean;
	digits: string[];
}

const GuildSchema = new Schema({
	id: { type: String, require: true },
	premium: { type: Boolean, default: false },
	blocked: { type: Boolean, default: false },
	language: { type: String },
	locale: { type: String },
	shortNumber: { type: Boolean, default: true },
	digits: {
		type: Array,
		default: [
			"<a:0G:701869754616512672>",
			"<a:1G:701869754578894939>",
			"<a:2G:701869754641547324>",
			"<a:3G:701869754717175828>",
			"<a:4G:701869754880753824>",
			"<a:5G:701869754763182080>",
			"<a:6G:701869754641809529>",
			"<a:7G:701869754402734183>",
			"<a:8G:701869754356596869>",
			"<a:9G:701869754687815720>"
		],
		require: true
	}
});

const GuildModel = model<GuildSettingsDocument>("guilds", GuildSchema);

export { GuildModel, GuildSettingsDocument };
export default GuildModel;
