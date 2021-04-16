const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  
    timeStamp: {
        type: Date,
        default: new Date()
    },

    patientID: {
        type: String,
        required: true
    }, 

    name: {
        type: String,
        required: true
    },    

    surname: {
        type: String,
        required: true
    },  

    gender: {
        type: String,
        required: false 
    },
    
    birthDate: {
        type: String,
        required: false 
    },

    address: {
        type: String,
        required: false  
    },

    postCode: {
        type: String,
        required: false 
    },

    homeTel: {
        type: String,
        required: false 
    },

    mobileTel: {
        type: String,
        required: false 
    },

    email: {
        type: String,
        required: true
    },   

    deleted: {
        type: Boolean,
        required: true,
        default: false
    },

    formData: {
        type: String,
        required: false
    },

});

module.exports = {
        Patient : mongoose.model('Patient', PatientSchema)
} 