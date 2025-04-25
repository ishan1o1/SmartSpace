const express = require('express');
const router = express.Router();
const studentModel = require('../models/student');
const mentorModel = require('../models/mentor');
const userModel = require('../models/user');
const { isLoggedIn } = require('../middleware/isLoggedIn');


router.get('/profile/:studentId',isLoggedIn, async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const student = await studentModel.findById(studentId)
    let user = await userModel.findById(req.user.userId);
    if (!student) return res.status(404).send('Student not found');
    res.status(200).json({ studentData: student, userData: user });

    
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post('/:studentId/:mentorId/reviews',isLoggedIn, async (req, res) => {
  try {
    const { studentId,mentorId } = req.params;
    const { reviewText, 
      rating } = req.body;

    if (!reviewText || !rating) {
      return res.status(400).json({ message: 'Review text and rating are required.' });
    }
    const student = await studentModel.findOne({ user: req.user.userId });
    if (!student || student._id.toString() !== studentId) {
      return res.status(403).json({ message: 'Only the logged-in student can leave reviews.' });
    }

    const mentor = await mentorModel.findById(mentorId);
    if (!mentor) return res.status(404).json({ message: 'Mentor not found.' });
    
    const existingReview = mentor.reviews.find(review => review.reviewer.toString() === studentId);
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this mentor.' });
    }

    const review = {
      reviewer: studentId,
      reviewText,
      rating,
    };

    student.reviews.push(review);
    await student.save();
    mentor.reviews.push(review);
    await mentor.save();

    res.status(201).json({ message: 'Review added successfully', mentor });
  } catch (err) {
    console.error('Error adding review:', err);
    res.status(500).json({ message: err.message });
  }
});

router.post("/register/:userId", isLoggedIn, async (req, res) => {
  try {
    

    const userId = req.params.userId;
    const user = await userModel.findById(userId).select("-password");
    const check = await studentModel.findOne({user:userId});
    if(check) return res.status(400).json({ message: "Student already exists" });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (user.role !== "student") {
      return res.status(400).json({ error: "User must have a role of 'student' to register." });
    }
      const student = await studentModel.create({
          user,
          subject,
      });

      
      const newStudent = await studentModel.findById(student._id).populate("user");

      return res.status(201).json({
          message: "Student registered successfully",
          student: newStudent,
      });

  } catch (err) {
      console.error("Error in /register/:userId route:", err);
      return res.status(500).json({ message: err.message });
  }
});
router.put('/update/:studentId', async (req, res) => {
  const { studentId } = req.params;
  const updateData = req.body;

  try {
    const updatedStudent = await studentModel.findByIdAndUpdate(
      studentId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({
      message: 'Student updated successfully',
      student: updatedStudent
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.get("/mentors", async (req, res) => {
  try {
      const { location } = req.query;
      let filter = {};

      if (location) {
          filter.location = location;
      }

      const mentors = await mentorModel.find(filter).populate("user");

      if (mentors.length === 0) {
          return res.status(404).json({ message: "No mentors found" });
      }

      res.status(200).json({ mentors });

  } catch (err) {
      console.error("Error fetching mentors:", err);
      res.status(500).json({ message: err.message });
  }
});

module.exports = router
