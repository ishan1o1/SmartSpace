const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    isVerified: { 
        type: Boolean, 
        default: false
     },
    password: String,
    role:{
        type:String,
        enum:["student","mentor"],
        required:true
    }
});


module.exports = mongoose.model('user', userSchema);