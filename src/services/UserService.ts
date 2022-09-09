import UserModel, { UserSettingsDocument } from "../models/UserModel";

class UserService {
	private constructor(public id: string, private doc: UserSettingsDocument) {}

	public static async exists(id: string): Promise<boolean> {
		return !!(await UserModel.exists({ id }));
	}

	public static async init(id: string): Promise<UserService> {
		const doc = await UserModel.findOneAndUpdate(
			{ id: id },
			{},
			{ new: true, upsert: true }
		);
		return new UserService(id, doc);
	}

	public get badges(): number {
		return this.doc.badges;
	}

	public async grantBadge(badge: number): Promise<number> {
		this.doc.badges |= badge;
		this.doc.save();
		return this.doc.badges;
	}

	public async revokeBadge(badge: number): Promise<number> {
		this.doc.badges &= ~badge;
		this.doc.save();
		return this.doc.badges;
	}

	public get availableServerUpgrades(): number {
		return this.doc.availableServerUpgrades;
	}

	public async grantAvailableServerUpgrades(amount = 1): Promise<number> {
		this.doc.availableServerUpgrades += amount;
		this.doc.save();
		return this.doc.availableServerUpgrades;
	}

	public get credits(): number {
		return this.doc.credits;
	}

	public async grantCredits(amount = 1): Promise<number> {
		this.doc.credits += amount;
		this.doc.save();
		return this.doc.credits;
	}

	public async remove(): Promise<void> {
		await this.doc.remove();
	}
}

export default UserService;
