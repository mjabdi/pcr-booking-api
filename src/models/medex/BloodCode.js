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
    }

})



module.exports = {
    BloodCode: mongoose.model('BloodCode', BloodCodeSchema)
}

