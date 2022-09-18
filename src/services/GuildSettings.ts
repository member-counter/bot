import GuildLogModel, { GuildLogDocument } from "../models/GuildLogModel";
import GuildSettingsModel, {
	GuildSettingsDocument
} from "../models/GuildSettingsModel";
import UserModel from "../models/UserModel";

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

	public get language(): string {
		return this.doc.language;
	}

	public async setLanguage(value: string): Promise<string> {
		if (value === "server") {
			this.doc.language = undefined;
		} else {
			this.doc.language = value;
		}

		await this.doc.save();
		return this.language;
	}

	public get locale(): string {
		return this.doc.locale;
	}

	public async setLocale(value: string): Promise<string> {
		if (value === "settingsLanguage") {
			this.doc.locale = undefined;
		} else {
			this.doc.locale = value;
		}

		await this.doc.save();
		return this.locale;
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
	public get digits(): string[] {
		return this.doc.digits;
	}

	public async setDigit(number: number, value: string): Promise<void> {
		this.doc.digits[number] = value;
		this.doc.markModified("digits");
		await this.doc.save();
	}
	public async resetDigits(): Promise<void> {
		this.doc.digits = [
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
		];
		await this.doc.save();
	}
	public get counters(): Map<string, string> {
		return this.doc.counters;
	}

	public async setCounter(
		channelId: string,
		content: string
	): Promise<Map<string, string>> {
		this.doc.counters.set(channelId, content);
		await this.doc.save();
		return this.counters;
	}

	public async deleteCounter(channelId: string): Promise<void> {
		this.doc.counters.delete(channelId);
		await this.doc.save();
	}
}

export default GuildSettings;
