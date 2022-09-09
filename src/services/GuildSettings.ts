import GuildLogModel, { GuildLogDocument } from "../models/GuildLogModel";
import GuildSettingsModel, {
	GuildSettingsDocument,
	shortNumber
} from "../models/GuildSettingsModel";
import { UserError } from "../utils/UserError";
import { availableLocales } from "./i18n";
class GuildSettings {
	private constructor(public id: string, private doc: GuildSettingsDocument) {}

	public static async init(id: string): Promise<GuildSettings> {
		const doc = await GuildSettingsModel.findOneAndUpdate(
			{ id: id },
			{},
			{ new: true, upsert: true }
		);
		return new GuildSettings(id, doc);
	}

	public get locale(): string {
		return this.doc.locale;
	}

	public async setLocale(value: string): Promise<void> {
		if (!["server", ...availableLocales].includes(value)) {
			throw new UserError("SERVICE_GUILD_SETTINGS_INVALID_LOCALE");
		}

		if (value === "server") {
			this.doc.locale = undefined;
		} else {
			this.doc.locale = value;
		}

		await this.doc.save();
	}
	public async log(text: string): Promise<void> {
		await GuildLogModel.create({ id: this.id, text });
	}

	public async getLatestLogs(amount = 20): Promise<GuildLogDocument[]> {
		const latestLogs = await GuildLogModel.find({ id: this.id })
			.limit(amount)
			.sort({ timestamp: 1 });
		return latestLogs;
	}
	public async delete() {
		await this.doc.delete();
	}
	// -1 = disabled
	public async setShortNumber(state: shortNumber): Promise<shortNumber> {
		this.doc.shortNumber = state;
		await this.doc.save();
		return this.doc.shortNumber;
	}
	get shortNumber(): shortNumber {
		return this.doc.shortNumber;
	}
}

export default GuildSettings;
