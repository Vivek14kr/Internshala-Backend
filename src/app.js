const express = require("express");
const cors = require("cors");
const authController = require("./controllers/auth.controller");
const carController = require("./controllers/cars.controller");
const bookingController = require("./controllers/booking.controller");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authController);

app.use("/car",carController)


app.use("/booking", bookingController);

module.exports = app;
