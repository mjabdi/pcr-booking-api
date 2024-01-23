const mongoose = require("mongoose");

const WorkingHoursSchema = new mongoose.Schema({
  service: {
    type: String,
    required: true,
    unique: true,
  },
  startingHourMonday: {
    type: Number,
    default: null,
  },
  endingHourMonday: {
    type: Number,
    default: null,
  },
  periodMonday: {
    type: Number,
    default: null,
  },
  startingHourTuesday: {
    type: Number,
    default: null,
  },
  endingHourTuesday: {
    type: Number,
    default: null,
  },
  periodTuesday: {
    type: Number,
    default: null,
  },
  startingHourWednesday: {
    type: Number,
    default: null,
  },
  endingHourWednesday: {
    type: Number,
    default: null,
  },
  periodWednesday: {
    type: Number,
    default: null,
  },
  startingHourThursday: {
    type: Number,
    default: null,
  },
  endingHourThursday: {
    type: Number,
    default: null,
  },
  periodThursday: {
    type: Number,
    default: null,
  },
  startingHourFriday: {
    type: Number,
    default: null,
  },
  endingHourFriday: {
    type: Number,
    default: null,
  },
  periodFriday: {
    type: Number,
    default: null,
  },
  startingHourSaturday: {
    type: Number,
    default: null,
  },
  endingHourSaturday: {
    type: Number,
    default: null,
  },
  periodSaturday: {
    type: Number,
    default: null,
  },
  startingHourSunday: {
    type: Number,
    default: null,
  },
  endingHourSunday: {
    type: Number,
    default: null,
  },
  periodSunday: {
    type: Number,
    default: null,
  },
});

module.exports = {
  WorkingHours: mongoose.model("MedexWorkingHours", WorkingHoursSchema),
};
