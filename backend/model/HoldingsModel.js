const mongoose = require("mongoose");

const { HoldingsSchema } = require("../schemas/HoldingsSchema");

// Create and export the model
const HoldingsModel = mongoose.model("holding", HoldingsSchema);

module.exports = { HoldingsModel };