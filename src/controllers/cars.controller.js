const express = require("express");
const router = express.Router();
const authenticate = require("../utils/auth")

const Car= require("../models/carSchema");
const Booking= require("../models/BookingSchema");



router.patch("/:id", authenticate, async (req, res) => {
  try {
    if (req.user.type !== "agency") {
        return res.status(403).json({ error: "Unauthorized access" });
      }
    const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .lean()
      .exec();

    return res.status(201).send(updatedCar);
  } catch (e) {
    return res.status(500).json({ message: e.message, status: "Failed" });
  }
});
router.delete("/:id", authenticate, async (req, res) => {
  try {
    if (req.user.type !== "agency") {
      return res.status(403).json({ error: "Unauthorized access" });
    }
   
    const updatedCar = await Car.findByIdAndDelete(req.params.id)
      .lean()
      .exec();
       await Booking.findOneAndDelete({ car: req.params.id });

    return res.status(201).send(updatedCar);
  } catch (e) {
    return res.status(500).json({ message: e.message, status: "Failed" });
  }
});


// Implement the 'Add new cars' route
router.post("/add_car", authenticate, (req, res) => {
  // Check if the user is an agency
 
  if (req.user.type !== "agency") {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  // Extract the car details from the request body
  const { model, number, seatingCapacity, rentPerDay } = req.body;

  console.log(model, number, seatingCapacity, rentPerDay);
  // Create a new car object
  const car = new Car({
    vehicleModel:model,
    vehicleNumber:number,
    seatingCapacity,
    rentPerDay,
    agencyId: req.user.id,
  });

  // Save the new car in the database
  car
    .save()
    .then((newCar) => {
      res.status(200).json({ message: "Car added successfully", newCar });
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to add car" });
    });
});

// Implement the 'Available cars to rent' route
router.get("/available-cars-to-rent", authenticate, (req, res) => {
  // Find all the available cars in the database
  console.log(req.user,)
  Car.find({ agencyId: req.user.id })
    .then((cars) => {
      res.status(200).json({cars});
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to retrieve cars" });
    });
});

//All cars


// Implement the 'Available cars to rent' route
router.get("/all-cars",(req, res) => {
  // Find all the available cars in the database

  Car.find({available:true})
    .then((cars) => {
      res.status(200).json({cars});
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to retrieve cars" });
    });
});

// Implement the 'Rent Car' route
router.post("/rent-car/:id", authenticate, (req, res) => {
  // Check if the user is a customer
  if (req.user.type !== "customer") {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  // Extract the car ID from the request parameters
  const { id } = req.params;

  // Extract the number of days and start date from the request body
  const { days, startDate, carAgency, amount} = req.body;

  // Find the car with the given ID
  Car.findById(id)
    .then((car) => {
      // Check if the car was found
      if (!car) {
        return res.status(404).json({ error: "Car not found" });
      }
      car.available = false;

      car.save();


      // Create a new booking object
      const booking = new Booking({
        car: car._id,
        customer: req.user.id,
        days,
        startDate,
        amount: amount,
        carAgency: carAgency
      });

      // Save the new booking in the database
      booking
        .save()
        .then((newBooking) => {
          res
            .status(200)
            .json({ message: "Car rented successfully", newBooking });
        })
        .catch((error) => {
          res.status(500).json({ error: "Failed to rent car" });
        });
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to retrieve car" });
    });
});


module.exports = router;
