const mongoose = require('mongoose')

const InvoiceSchema = new mongoose.Schema({
  timeStamp: {
    type: Date,
    default: new Date(),
  },

  name: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    default: new Date(),
  },

  dateAttended: {
    type: Date,
    default: new Date(),
  },

  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
  },

  items: {
    type: Array,
    required: true,
  },

  grandTotal: {
    type: Number,
    required: true,
  },

  bookingId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },

  address: {
    type: String,
    required: false,
  },

  postCode: {
    type: String,
    required: false,
  },

  notes: {
    type: String,
    required: false,
  },
  corporate: {
    type: String,
    required: false,
  },
  corporateAddress: {
    type: String,
    required: false,
  }
});



module.exports = {
    Invoice : mongoose.model('Invoice', InvoiceSchema)
}

