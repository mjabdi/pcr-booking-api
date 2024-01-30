const mongoose = require('mongoose')

const OldPatientsSchema = new mongoose.Schema({
  surname: {
    type: String,
    required: true,
  },
  forename: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: false,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: true,
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
});

module.exports = {
  OldPatients: mongoose.model("OldPatients", OldPatientsSchema),
};

