import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  user: { type: String, require: true },
  premium: { type: Boolean, default: false },
  availableServerUpgrades: { type: Number, default: 0 },
});

export default mongoose.model('users', UserSchema);
