import mongoose, { Schema, models } from 'mongoose';


const FuelPriceSchema = new Schema({
  type: { type: String, required: true }, 
  price: { type: Number, required: true }, 
});

export default models.FuelPrice || mongoose.model('FuelPrice', FuelPriceSchema);
