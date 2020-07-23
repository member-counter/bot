import { model, Schema, Document, DocumentToObjectOptions } from 'mongoose';
import getEnv from '../utils/getEnv';

const { DISCORD_PREFIX } = getEnv();

interface GuildSettings {
	guild?: string;
	premium?: boolean;
	prefix?: string;
	language?: string;
	allowedRoles?: string[];
	counters?: Map<string, string>;
	shortNumber?: boolean;
	locale?: string;
	digits?: string[];
}

interface GuildSettingsDocument extends GuildSettings, Document {
	toObject(options?: DocumentToObjectOptions): GuildSettings;
}

const GuildSchema = new Schema({
	guild: { type: String, require: true },
	premium: { type: Boolean, default: false },
	prefix: { type: String, default: DISCORD_PREFIX },
	language: { type: String, default: 'en_US' },
	allowedRoles: [{ type: String, default: [] }],
	counters: { type: Map, of: String, default: new Map() },
	shortNumber: { type: Boolean, default: false },
	locale: { type: String, default: 'disabled' },
	digits: {
		type: Array,
		default: [
			'<a:0G:701869754616512672>',
			'<a:1G:701869754578894939>',
			'<a:2G:701869754641547324>',
			'<a:3G:701869754717175828>',
			'<a:4G:701869754880753824>',
			'<a:5G:701869754763182080>',
			'<a:6G:701869754641809529>',
			'<a:7G:701869754402734183>',
			'<a:8G:701869754356596869>',
			'<a:9G:701869754687815720>',
		],
		require: true,
	},
});

const GuildModel = model<GuildSettingsDocument>('guilds', GuildSchema);

export { GuildModel, GuildSettingsDocument, GuildSettings };
export default GuildModel;
