import mongoose, { Schema, models } from 'mongoose';

const CostEstimateSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  fromLocation: { type: String, required: true, trim: true },
  toLocation: { type: String, required: true, trim: true },
  vehicleType: { type: String, required: true },
  fuelType: { type: String, required: true },
  distance: { type: Number, required: true },
  mileage: { type: Number }, // Not required for electric
  batteryCapacity: { type: Number }, // Only for electric
  range: { type: Number }, // Only for electric
  estimatedCost: { type: Number, required: true },
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

const CostEstimate = models.CostEstimate || mongoose.model('CostEstimate', CostEstimateSchema);

export default CostEstimate;