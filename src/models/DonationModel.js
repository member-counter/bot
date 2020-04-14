import mongoose from 'mongoose';

const DonationSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user: { type: String, require: true },
  note: { type: String },
  anonymous: { type: Boolean, default: false },
  amount: { type: Number, require: true },
  currency: { type: String, require: true },
  date: { type: Date, default: new Date() },
});

export default mongoose.model('donations', DonationSchema);
