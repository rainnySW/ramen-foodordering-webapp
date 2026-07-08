import mongoose from 'mongoose';

const MenuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  name_th: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true }, // e.g., "Ramen", "Appetizer", "Beverage"
  image_url: { type: String, required: true },
  description: { type: String },
  description_th: { type: String },
  is_available: { type: Boolean, default: true }
});

export default mongoose.models.Menu || mongoose.model('Menu', MenuSchema);
