const { Schema, model } = require("mongoose");

const carSchema = new Schema(
  {
    vehicleModel: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    seatingCapacity: { type: Number, required: true },
    rentPerDay: { type: Number, required: true },
    available: { type: Boolean, required: true, default: true },
    agencyId: {
      type: Schema.Types.ObjectId,

      ref: "User",
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = model("Car", carSchema);
