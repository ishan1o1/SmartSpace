const mongoose = require('mongoose');
const userModel = require('./user'); 

const mentorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', 
        required: true
    },
    profilePic: {
        type:String,
        required: true,
    },
    qualifications: { 
        type: [String], 
        default: [] 
    },
    subjects: { 
        type: [String], 
        default: [] 
    },
    hourlyRate: {
        type: Number,
        default: 300,
    },
    bio: {
        type: String,
        default: "",
    },
    reviews: [{
        reviewer: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        reviewText: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }],
    location: {
        type: {
            type: String,
            enum: ['Point'], 
            required: true,
        },
        coordinates: {
            type: [Number], 
            required: true,
        },
    },
    
    dateAdded: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('mentor', mentorSchema);
