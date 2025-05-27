const mongoose = require('mongoose');
const ParkingRecordCurrent = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, refPath: 'vehicleModel', required: true },
  vehicleModel: { type: String, enum: ['ResidentVehicle', 'VisitorVehicle'], required: true },
  entryTime: { type: Date, default: Date.now },
  exitTime: { type: Date },
  status: { type: String, enum: ['IN', 'OUT'], default: 'IN' },
});
module.exports = mongoose.model('ParkingRecordCurrent', ParkingRecordCurrent);