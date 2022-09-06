import GuildSettingsModel, {
	GuildSettingsDocument
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

	public async delete() {
		await this.doc.delete();
	}
}

export default GuildSettings;
