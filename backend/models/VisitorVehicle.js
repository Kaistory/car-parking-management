const mongoose = require('mongoose');

const VisitorVehicle = new mongoose.Schema({
  plateNumber: { type: String, required: true },
  visitorName: { type: String },
  rfidTag: { type: String, unique: true },
});

module.exports = mongoose.model('VisitorVehicle', VisitorVehicle);