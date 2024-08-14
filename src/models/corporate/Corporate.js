const mongoose = require('mongoose');
const CorporateSchema = new mongoose.Schema({
  timeStamp: {
    type: Date,
    default: new Date(),
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  deleted: {
    type: Boolean,
    required: false,
  },
});

module.exports = {
  Corporate: mongoose.model("Corporate", CorporateSchema),
};