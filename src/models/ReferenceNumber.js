const mongoose = require('mongoose');

const ReferenceNumber = mongoose.model('ReferenceNumber', new mongoose.Schema({
 
    refNo :{
        type: String,
        required: true,
        unique: true
    }

}));


exports.ReferenceNumber = ReferenceNumber; 