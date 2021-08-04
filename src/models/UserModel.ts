import { model, Schema, Document } from "mongoose";

interface UserSettingsDocument extends Document {
	id: string;
	badges: number;
	availableServerUpgrades: number;
}

const UserSchema = new Schema({
	id: { type: String, require: true },
	badges: { type: Number, default: 0 },
	availableServerUpgrades: { type: Number, default: 0 }
});

const UserModel = model<UserSettingsDocument>("users", UserSchema);

export { UserModel, UserSettingsDocument };
export default UserModel;
