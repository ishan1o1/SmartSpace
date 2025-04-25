const mongoose = require('mongoose');
const user = require('./user'); 

const studentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId,
     ref: 'user',
     required: true
   },
  courses: [
    {
      courseName: String,
      instructor: String
    }
  ],
    subject:
      {
       type: String,
      }
    ,

  reviews: [
    {
       
      reviewText: { type: String, required: true }, 
      rating: { type: Number, min: 1, max: 5, default: 5 }, 
      date: { type: Date, default: Date.now } 
    }
  ]
});

module.exports = mongoose.model('student', studentSchema);
