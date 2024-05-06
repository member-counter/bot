import { model, Schema, HydratedDocument } from "mongoose";
import getEnv from "../utils/getEnv";

const { DISCORD_DEFAULT_LANG } = getEnv();

interface GuildSettings {
	id: string;
	premium: boolean;
	language: string;
	allowedRoles: string[];
	counters: Map<string, string>;
	shortNumber: number;
	locale: string;
	digits: string[];
	blocked: boolean;
}

type GuildSettingsDocument = HydratedDocument<GuildSettings>;

const GuildSchema = new Schema<GuildSettings>({
	id: { type: String, require: true },
	premium: { type: Boolean, default: false },
	language: { type: String, default: DISCORD_DEFAULT_LANG },
	allowedRoles: [{ type: String, default: [] }],
	counters: { type: Map, of: String, default: new Map() },
	shortNumber: { type: Number, default: 1 },
	locale: { type: String, default: "disabled" },
	blocked: { type: Boolean, default: false },
	digits: [
		{
			type: String,
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
	]
});

const GuildModel = model<GuildSettingsDocument>("guilds", GuildSchema);

export { GuildModel, GuildSettingsDocument };
export default GuildModel;
