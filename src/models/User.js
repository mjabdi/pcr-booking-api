const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10

const UserSchema = new mongoose.Schema({
  
    timeStamp: {
        type: Date,
        default: Date()
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    fullname: {
        type: String,
        required: true,
    },

    lastLoginTimeStamp: {
        type: Date,
        default: null
    },

    isLocked: {
        type: Boolean,
        default: false
    },

    failedRetries: {
        type: Number,
        default: 0
    },

    password: {
        type: String,
        required: true
    },

    isActive: {
        type: Boolean,
        default: false
    },
    
    authToken: {
        type: String,
        required: false
    }

})

UserSchema.pre('save', function(next) {
    var user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
            if (err) 
            {
                reject()
            }
            else
            {
                return resolve(isMatch)
            }    
        })
    })
}

module.exports = {
    User: mongoose.model('User', UserSchema)
}

