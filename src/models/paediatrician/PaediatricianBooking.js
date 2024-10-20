const mongoose = require('mongoose');

const PaediatricianBookingSchema = new mongoose.Schema({
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

  smsPush: {
    type: Boolean,
    default: false,
  },

  smsSent: {
    type: Boolean,
    required: false,
  },

  prepaid: {
    type: Boolean,
    required: false,
  },

  gender: {
    // F/M
    type: String,
    required: false,
  },

  birthDate: {
    type: String,
    required: false,
  },
  doctorNote: {
    type: String,
    required: false,
  },
});

module.exports = {
  PaediatricianBooking: mongoose.model(
    "PaediatricianBooking",
    PaediatricianBookingSchema
  ),
}; 