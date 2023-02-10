const express = require("express");
const router = express.Router();
const Booking = require("../models/BookingSchema.js");
const authenticate = require("../utils/auth.js");

// Implement the 'View booked cars' route
router.get("/viewBookedCars", authenticate, async (req, res) => {
  try {
    if (req.user.type !== "agency") {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    // Find all bookings where the car was added by the agency
    const bookings = await Booking.find({ carAgency: req.user.id });
    console.log(bookings, " bdjf");
    // Populate the customer field to get the customer details
    const populatedBookings = await Promise.all(
      bookings.map(async (booking) => await booking.populate("car"))
    );
    const newbooking = await Promise.all(
      populatedBookings.map(
        async (booking) => await booking.populate("customer")
      )
    );

    const customerDetails = newbooking.map((booking) => {
      return {
        car: booking.car.vehicleModel,
        number: booking.car.vehicleNumber,
        rentPerDay: booking.car.rentPerDay,

        customerName: booking.customer.name,
        customerEmail: booking.customer.email,
        startDate: booking.startDate,
        days: booking.days,
        amount: booking.amount,
      };
    });

    // Return the customer details to the agency
    res.json({
      success: true,
      customers: customerDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving the booked cars",
      error: error.message,
    });
  }
});

module.exports = router;
