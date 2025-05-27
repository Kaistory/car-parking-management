const mongoose = require('mongoose');

const ResidentVehicle = new mongoose.Schema({
  apartmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Apartment', required: true },
  plateNumber: { type: String, required: true, unique: true },
  vehicleType: { type: String },
  rfidTag: { type: String, unique: true },
});

module.exports = mongoose.model('ResidentVehicle', ResidentVehicle);