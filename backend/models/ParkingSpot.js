const mongoose = require('mongoose');

const ParkingSpot = new mongoose.Schema({
  spotNumber: { type: String, required: true, unique: true },
  isOccupied: { type: Boolean, default: false },
});

module.exports = mongoose.model('ParkingSpot', ParkingSpot);
