const mongoose = require('mongoose');

const OVBookingSchema = new mongoose.Schema({
  
    timeStamp: {
        type: Date,
        default: new Date()
    },

    fullname: {
        type: String,
        required: true
    },    

    email: {
        type: String,
        required: true
    },   

    phone: {
        type: String,
        required: true
    },  
    
    faceToFaceConsultation: {
        type: Boolean,
        required: false,
    },

    telephoneConsultation: {
        type: Boolean,
        required: false,
    },

    bookingDate: {
        type: String,
        required: false,
    },

    bookingTime: {
        type: String,
        required: false,
    },

    status: {
        type: String,
        required: false,
        default: 'booked'
    },

    questions: {
        type: String,
        required: false,
    },


    deleted: {
        type: Boolean,
        required: true,
        default: false
    },

    referrer: {
        type: String,
        required: false
    },

    birthDate: {
        type: String,
        required: false
    },

    notes: {
        type: String,
        required: false
    },

    clinic: {
        type: String,
        required: false
    },

});

module.exports = {
        OVBooking : mongoose.model('OVBooking', OVBookingSchema)
} 