const mongoose = require("mongoose");

const WorkingHoursSchema = new mongoose.Schema({
  service: {
    type: String,
    required: true,
    unique: true,
  },
  startingHour: {
    type: Number,
    required: true,
  },
  endingHour: {
    type: Number,
    required: true,
  },
  period: {
    type: Number,
    default: 0.5,
  },
  unavailabelTimes: {
    type: [String],
    default: [],
  },
  weekendStartingHour: {
    type: Number,
    required: true,
  },
  weekendEndingHour: {
    type: Number,
    required: true,
  },
  weekendPeriod: {
    type: Number,
    default: 0.5,
  },
  weekendUnavailabelTimes: {
    type: [String],
    default: [],
  },
});

module.exports = {
  WorkingHours: mongoose.model("MedexWorkingHours", WorkingHoursSchema),
};
