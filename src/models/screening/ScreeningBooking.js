const mongoose = require("mongoose");

const ScreeningBookingSchema = new mongoose.Schema({
  timeStamp: {
    type: Date,
    default: new Date(),
  },

  fullname: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  birthDate: {
    type: String,
    required: false,
  },

  phone: {
    type: String,
    required: true,
  },

  notes: {
    type: String,
    required: false,
  },

  clinicNotes: {
    type: String,
    required: false,
  },

  service: {
    type: String,
    required: true,
  },

  confirmed: {
    type: Boolean,
    default: false,
  },

  bookingDate: {
    type: String,
    required: true,
  },

  bookingTime: {
    type: String,
    required: true,
  },

  bookingRef: {
    type: String,
    required: true,
  },

  paid: {
    type: Boolean,
    default: false,
  },

  paidBy: {
    type: String,
    required: false,
  },

  corporate: {
    type: String,
    required: false,
  },

  bookingTimeNormalized: {
    type: String,
    required: false,
  },

  status: {
    type: String,
    required: false,
    default: "booked",
  },

  deleted: {
    type: Boolean,
    required: true,
    default: false,
  },

  referrer: {
    type: String,
    required: false,
  },

  deposit: {
    type: Number,
    default: 0,
  },

  OTCCharges: {
    type: Number,
    default: 0,
  },

  paymentInfo: {
    type: String,
    required: false,
  },

  refund: {
    type: String,
    required: false,
  },

  formData: {
    type: String,
    required: false,
  },

  timeChanged: {
    type: Boolean,
    default: false,
  },

  tbcFolder: {
    type: Boolean,
    default: false,
  },

  price: {
    type: String,
    required: false,
  },

  printStatus: {
    // preparing - printing - printed
    type: String,
    required: false,
  },

  gender: {
    // F/M
    type: String,
    required: false,
  },

  address: {
    type: String,
    required: false,
  },

  smsPush: {
    type: Boolean,
    default: false,
  },

  reportData: {
    type: String,
    required: false,
  },
  paymentType: {
    type: String,
    default: "paypal",
  },
  smsSent: {
    type: Boolean,
    required: false,
  },
  doctorNote: {
    type: String,
    required: false,
  },
});

module.exports = {
  ScreeningBooking: mongoose.model("ScreeningBooking", ScreeningBookingSchema),
};
