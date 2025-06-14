const mongoose = require('mongoose');
const ParkingRecord = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, refPath: 'vehicleModel', required: true },
  vehicleModel: { type: String, enum: ['ResidentVehicle', 'VisitorVehicle'], required: true },
  entryTime: { type: Date, default: Date.now },
  exitTime: { type: Date },
  status: { type: String, enum: ['IN', 'OUT'], default: 'IN' },
});
module.exports = mongoose.model('ParkingRecord', ParkingRecord);