const mongoose = require('mongoose');

const MuseumPaymentSchema = new mongoose.Schema({
  
    timeStamp: {
        type: Date,
        default: new Date()
    },

    fullname: {
        type: String,
        required: true
    },    

    amount : {
        type: Number,
        required : true,
    },

    email: {
        type: String,
        required: false
    },   

    phone: {
        type: String,
        required: false
    },  
    
    description : {
        type: String,
        required: false
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

    paymentInfo: {
        type: String,
        required: false
    },

    refund: {
        type: String,
        required: false
    },

});

module.exports = {
    MuseumPayment : mongoose.model('DentistPayment', MuseumPaymentSchema)
}