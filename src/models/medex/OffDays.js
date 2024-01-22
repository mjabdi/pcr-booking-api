const mongoose = require("mongoose");

const OffDaysSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  offset: {
    type: Number,
    default: new Date().getTimezoneOffset(),
  },
  service: {
    type: String,
    required: true
  },
  timeStamp: {
    type: Date,
    default: new Date(),
  },
});

module.exports = {
  OffDays: mongoose.model("MedexOffDays", OffDaysSchema),
};
