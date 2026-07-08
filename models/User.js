import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'Guest'
  },
  email: {
    type: String,
    sparse: true,
    unique: true,
    default: null
  },
  password: {
    type: String,
    default: null
  },
  isRegistered: {
    type: Boolean,
    default: false
  },
  tableNumber: {
    type: String,
    default: null
  },
  orderCount: {
    type: Number,
    default: 0
  },
  preferences: {
    ThemeSetting: { type: String, enum: ['light', 'dark'], default: 'light' },
    LanguageSetting: { type: String, enum: ['en', 'th'], default: 'th' }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
