import GuildLogModel, { GuildLogDocument } from "../models/GuildLogModel";
import GuildSettingsModel, {
	GuildSettingsDocument
} from "../models/GuildSettingsModel";
import UserModel from "../models/UserModel";
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

	public get blocked(): boolean {
		return this.doc.blocked;
	}

	public async resetSettings(): Promise<void> {
		const premiumStatus = this.premium;
		const blockedStatus = this.blocked;
		await GuildLogModel.deleteMany({ id: this.id });
		await GuildSettingsModel.findOneAndRemove({ id: this.id });
		this.doc = await GuildSettingsModel.create({
			id: this.id,
			premium: premiumStatus,
			blocked: blockedStatus
		});
	}

	public async setShortNumber(state: boolean): Promise<boolean> {
		this.doc.shortNumber = state;
		await this.doc.save();
		return this.doc.shortNumber;
	}

	get shortNumber(): boolean {
		return this.doc.shortNumber;
	}

	get premium(): boolean {
		return this.doc.premium;
	}
	public async upgradeServer(grantorId: string): Promise<void> {
		if (this.premium) throw new Error("alreadyUpgraded");

		const userDoc: any = await UserModel.findOneAndUpdate(
			{ id: grantorId },
			{},
			{ new: true, upsert: true }
		);

		if (userDoc.availableServerUpgrades <= 0)
			throw new Error("noUpgradesAvailable");

		userDoc.availableServerUpgrades -= 1;
		this.doc.premium = true;

		await this.doc.save();
		await userDoc.save();

		return;
	}
}

export default GuildSettings;
