const mongoose = require('mongoose');

const MedexPaymentSchema = new mongoose.Schema({
  
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

    notes : {
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

    emailSent: {
        type: Boolean,
        required: false
    },

    textSent: {
        type: Boolean,
        required: false
    },

    paymentTimeStamp: {
        type: Date,
        required : false
    },

    refundTimeStamp: {
        type: Date,
        required : false
    }


});

module.exports = {
    MedexPayment : mongoose.model('MedexPayment', MedexPaymentSchema)
}