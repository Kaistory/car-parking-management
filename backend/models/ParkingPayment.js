const mongoose = require('mongoose');

const ParkingPaymentSchema = new mongoose.Schema({
  apartmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Apartment', required: true },
  amountPaid: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ParkingPayment', ParkingPaymentSchema);