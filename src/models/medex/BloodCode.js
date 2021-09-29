const mongoose = require('mongoose')

const BloodCodeSchema = new mongoose.Schema({
  
    code: {
        type: String,
        required: true,
    },

    description: {
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
    },

    hidden: {
        type: Boolean,
        required: false
    }

})



module.exports = {
    BloodCode: mongoose.model('BloodCode', BloodCodeSchema)
}

