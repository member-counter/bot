import { model, Schema, HydratedDocument } from "mongoose";

interface UserSettings {
	id: string;
	badges: number;
	availableServerUpgrades: number;
	credits: number;
}

type UserSettingsDocument = HydratedDocument<UserSettings>;

const UserSchema = new Schema<UserSettings>({
	id: { type: String, require: true },
	badges: { type: Number, default: 0 },
	availableServerUpgrades: { type: Number, default: 0 },
	credits: { type: Number, default: 0 }
});

const UserModel = model<UserSettings>("users", UserSchema);

export { UserModel, UserSettingsDocument };
export default UserModel;
