const mongoose = require('mongoose');

const GynaeBooking = mongoose.model('GynaeBooking', new mongoose.Schema({
  
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
    
    service: {
        type: String,
        required: true
    },

    notes: {
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
        default: false
    },

    paidBy: {
        type: String,
        required: false
    },

    corporate: {
        type: String,
        required: false
    },
    
    bookingTimeNormalized : {
        type: String,
        required: false
    },

    status: {
        type: String,
        required: false,
        default: 'booked'
    },

    deleted: {
        type: Boolean,
        required: true,
        default: false
    },

    referrer: {
        type: String,
        required: false,
    },

}));


exports.GynaeBooking = GynaeBooking; 