const mongoose = require('mongoose');
const ParkingFeeSchema = new mongoose.Schema({
  vehicleType: { type: String, required: true },
  feeAmount: { type: Number, required: true },
  effectiveDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ParkingFee', ParkingFeeSchema);
