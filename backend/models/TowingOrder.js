const mongoose = require("mongoose");

const TowingOrderSchema = new mongoose.Schema(
  {
    carBody: { type: String, required: true },
    amount: { type: Number, required: true },
    email: { type: String, required: true },
    paymentId: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TowingOrder", TowingOrderSchema);
