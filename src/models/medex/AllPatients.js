const mongoose = require('mongoose')
const GynaeBookings = require('../gynae/GynaeBooking')
const GPBookings = require("../gp/GPBooking");
const AllPatientsSchema = new mongoose.Schema({
  surname: {
    type: String,
    required: false,
  },
  forename: {
    type: String,
    required: false,
  },
  fullname: {
    type: String,
    required: true,
    default: function () {
      return this.surname + " " + this.forename;
    },
  },
  birthDate: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", ""],
    required: true,
    default: ""
  },
  title: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  timeStamp: {
    type: Date,
    Default: new Date(),
  },
  phone: {
    type: String,
    required: false,
  },
  postCode: {
    type: String,
    required: false,
  },
  passportNumber: {
    type: String,
    required: false,
  },
  patientId: {
    type: String,
    required: true,
    unique: true,
  },
  originalPatientId: {
    type: String,
    required: true,
    default: function () {
      return this.patientId.split('-')[0];
    },
  },
  bookings: {
    type: [mongoose.Schema.Types.ObjectId],
    refPath: [
      "BloodBooking",
      "bloodreport",
      "CorporateBooking",
      "DentistBooking",
      "DermaBooking",
      "GynaeBooking",
      "GPBooking",
      "ScreeningBooking",
      "STDBooking",
      "Booking",
    ],
  },
});

module.exports = {
  AllPatients: mongoose.model("AllPatients", AllPatientsSchema),
};

