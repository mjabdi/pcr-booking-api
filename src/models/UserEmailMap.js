const mongoose = require('mongoose');

const UserEmailMap = mongoose.model('UserEmailMap', new mongoose.Schema({
 
    refNo :{
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
    },

    fullname: {
        type: String,
        required: true,
    }

}));


exports.UserEmailMap = UserEmailMap; 