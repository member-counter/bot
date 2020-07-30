import { model, Schema, Document, DocumentToObjectOptions } from 'mongoose';

interface UserSettings {
  user?: string;
  badges?: number;
  availableServerUpgrades?: number;
}

interface UserSettingsDocument extends UserSettings, Document {
	toObject(options?: DocumentToObjectOptions): UserSettings;
}


const UserSchema = new Schema({
  user: { type: String, require: true },
  badges: { type: Number, default: 0 },
  availableServerUpgrades: { type: Number, default: 0 },
});

const UserModel = model<UserSettingsDocument>('users', UserSchema);

export { UserModel, UserSettingsDocument, UserSettings };
export default UserModel;
