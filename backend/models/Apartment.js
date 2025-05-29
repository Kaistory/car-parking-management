const mongoose = require('mongoose');

const ApartmentSchema = new mongoose.Schema({
  ownerName: { type: String, required: true },
  apartmentNumber: { type: String, required: true, unique: true },
  floor: { type: Number },
  area: { type: Number }
});

module.exports = mongoose.model('Apartment', ApartmentSchema);