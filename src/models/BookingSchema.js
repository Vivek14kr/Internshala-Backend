const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Car",
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  days:{
    type: Number,
    required:true
  },
  startDate: {
    type: Date,
    required: true,
  },
  amount:{
      type: Number,
    required:true
  },
  carAgency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Booking = mongoose.model("Booking", BookingSchema);

module.exports = Booking;
