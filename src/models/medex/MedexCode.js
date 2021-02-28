const mongoose = require('mongoose')

const MedexCodeSchema = new mongoose.Schema({
  
    code: {
        type: String,
        required: true,
        unique: true
    },

    description: {
        type: String,
        required: true,
    },

    section: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
    },

    index: {
        type: Number,
        required: true,
    }



})



module.exports = {
    MedexCode: mongoose.model('MedexCode', MedexCodeSchema)
}

