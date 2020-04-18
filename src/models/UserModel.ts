import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  user: { type: String, require: true },
  badges: { type: Number, default: 0 },
  availableServerUpgrades: { type: Number, default: 0 },
});

export default mongoose.model('users', UserSchema);
