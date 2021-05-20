const mongoose = require('mongoose');

const EmailTemplateSchema = new mongoose.Schema({
  
    timeStamp: {
        type: Date,
        default: new Date()
    },

    templateID: {
        type: String,
        required: true
    }, 

    subject: {
        type: String,
        required: true
    },

    html: {
        type: String,
        required: true
    },

    rawText:{
        type: String,
        required: true
    },

    parameters: {
        type: String,
        required: false
    },

    sendWhenBookedCalendar:{
        type: Boolean,
        required: false
    },

    clinic: {
        type: String,
        required: false
    },

});

module.exports = {
        EmailTemplate : mongoose.model('EmailTemplate', EmailTemplateSchema)
} 